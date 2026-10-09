/**
 * Practice figures — AUTHORING-time renderer: `{ type, params }` → one
 * standalone `<svg>` string, stored on a ProblemBank row's `figure.svg` and
 * served to partner pages (contract v1.21.0 `PracticeFigureSchema`).
 *
 * What "standalone" means here, and why each point matters on a partner page:
 *   - viewBox only, no pixel width/height — it fills whatever column it is
 *     put in, 340 px on a phone included;
 *   - an explicit white background and a system font stack on the root —
 *     nothing depends on the engine's CSS (Tailwind, KaTeX, Mafs);
 *   - every id is prefixed with a hash of the spec, so two figures inlined
 *     on one page cannot capture each other's clip paths or arrowheads;
 *   - it passes `validateFigureSvg` (svg-safety.ts) or this module throws —
 *     the same check runs again when the row is served;
 *   - NOTHING THAT STATES THE ANSWER is drawn unless the spec asks: no
 *     values over bars, no "ΔH = −40", no equivalence-point read-out, no
 *     trend-line equation, no dy/dx caption, no title. Each is an explicit
 *     opt-in param below.
 *
 * HOW EACH KIND IS DRAWN (2026-10-09 — tried first, as the brief asked, with
 * the board's own renderers through `renderToStaticMarkup`):
 *   - free_body_diagram: the board's FreeBodyDiagramRenderer, post-processed
 *     into a standalone SVG (`standaloneFromMarkup`). Its picture carries
 *     over intact — including its label placement: with four or more forces
 *     a label can sit away from its arrow (the board puts horizontal-arrow
 *     labels over the shaft and then de-overlaps). That is NOT fixed here:
 *     moving the board's labels from outside means re-deriving its geometry
 *     from markup. Fix it in the board renderer, or redraw this kind here.
 *   - every axis-based kind: drawn HERE on the shared plot frame
 *     (plot-frame.ts). The board renderers were not usable for an item a
 *     student answers by reading the figure: the motion renderer smooths a
 *     piecewise-linear x(t) into a curve and numbers only the panel's
 *     min/max; the scatter axes tick at 49.2, 55.9, …; the bar chart,
 *     reaction-coordinate and titration renderers print the very values a
 *     question asks for (and the titration curve is one fixed 0.1 M / 25 mL
 *     case); all of them set 10–12 unit type on a 520–640 unit canvas, which
 *     is 6–7 px at 340 px wide. The function-graph board (Mafs) emits no SVG
 *     at all on the server and needs its CSS.
 *     The engine's pieces are still what is underneath: the expression
 *     normaliser (whiteboard/math-expr.ts via expr.ts), the bar-chart and
 *     line-plot solvers, the slope-sample shape, the Catmull-Rom smoother.
 *
 * KINDS AND PARAMS (all text params are plain text — Unicode, not LaTeX;
 * `title` is optional everywhere and drawn inside the figure when given):
 *
 * function_graph — y = f(x), several curves, points, asymptotes, pieces
 *   { xRange: [min, max]; yRange: [min, max];
 *     curves: Array<{ expr: string;                 // in x — see expr.ts
 *                     domain?: [min | null, max | null];   // a piece
 *                     from?: 'open' | 'closed' | 'none';   // endpoint mark at domain[0]
 *                     to?: 'open' | 'closed' | 'none';     // endpoint mark at domain[1]
 *                     continues?: boolean;          // a further piece of the curve before it
 *                     label?: string; color?: '#rrggbb'; dashed?: boolean }>;
 *     points?: Array<{ x: number; y: number; label?: string; open?: boolean }>;
 *     asymptotes?: Array<{ x: number; label?: string } | { y: number; label?: string }>;
 *     xStep?: number; yStep?: number; xLabel?: string ('x'); yLabel?: string ('y');
 *     xTickUnit?: 'pi'; xTickDivisor?: 1..12 (1);   // ticks at multiples of π ÷ divisor,
 *     yTickUnit?: 'pi'; yTickDivisor?: 1..12 (1) }  //   labelled −π, −π/2, 0, π/2, π, 2π
 *   End marks: an end of `domain` that lies INSIDE the plot is marked — a
 *   filled dot for an included endpoint (`'closed'`, and the default when
 *   the flag is left out), an open circle for an excluded one (`'open'`),
 *   nothing for `'none'`. An unflagged end has no mark when the curve simply
 *   leaves the plot there (the end is on or beyond xRange, or its y is
 *   outside yRange), or when the next piece of the same function carries
 *   straight on from it. Where a function stops being DEFINED (sqrt at 0)
 *   without a `domain` saying so, nothing is marked — give the domain.
 *   One function in pieces: an entry with no label, a non-overlapping
 *   domain and no colour of its own (or the same colour) is a piece of the
 *   curve before it — same colour, same dash, one legend entry.
 *   `continues: true / false` says so outright.
 *   Several curves: each gets a dash pattern as well as a colour (solid,
 *   dashed, dash-dot, dotted, …), repeated in its legend swatch; curves
 *   marked `dashed` take the broken patterns first. Asymptotes are dark grey
 *   long-dashed guides on a white under-line (drawn above the grid, so one on
 *   a gridline still reads as dashes).
 *
 * motion_graph — position–time / velocity–time / acceleration–time
 *   { quantity?: 'position' | 'velocity' | 'acceleration';   // default 'position'
 *     series: Array<{ points: Array<[t, value] | { t: number; value: number }>;
 *                     vertexDots?: 'all' | 'ends' | 'none';
 *                     label?: string; color?: string; dashed?: boolean }>;
 *     interpolation?: 'linear' | 'smooth';          // default 'linear' — corners stay corners
 *     showPoints?: boolean; tRange?: [min, max]; yRange?: [min, max];
 *     tStep?: number; yStep?: number; tLabel?: string ('Time (s)'); yLabel?: string }
 *   Dots: `showPoints: true` puts a dot on every vertex of every series.
 *   `vertexDots` overrides that for one series — `'ends'` marks only its
 *   first and last point (use it when the question asks WHERE a corner is:
 *   a dot on the corner gives the answer away), `'none'` marks nothing,
 *   `'all'` marks every vertex. With neither, a line that stops inside the
 *   plot still ends in a dot. Several series get a dash pattern each.
 *
 * bar_chart — categorical bars on a numbered axis
 *   { categories: string[]; values: number[];       // same length, 1–24
 *     yLabel?: string; xLabel?: string; yMin?: number; yMax?: number; yStep?: number;
 *     showValues?: boolean (false); colors?: string[] }
 *
 * line_plot — dot plot: one dot per data value over a number line TO SCALE
 *   { values: number[]; xLabel?: string; step?: number (tick spacing; inferred) }
 *
 * scatter_plot
 *   { points: Array<[x, y] | { x: number; y: number; label?: string; series?: string }>;
 *     xLabel?: string; yLabel?: string; xRange?: [min, max]; yRange?: [min, max];
 *     xStep?: number; yStep?: number;
 *     trendLine?: boolean | { slope: number; intercept: number };   // true = least squares
 *     showEquation?: boolean (false) }
 *   Several named series get a marker shape each (circle, square, triangle,
 *   diamond, …) as well as a colour.
 *
 * reaction_coordinate — energy profile (the board tool's snake_case names are accepted too)
 *   { productsEnergy: number; reactantsEnergy?: number (0);
 *     activationEnergies: number[];                 // one hump per entry (catalysed vs not), 1–4
 *     curveLabels?: string[]; reactantLabel?: string; productLabel?: string;
 *     units?: string ('kJ/mol'); showAxisValues?: boolean (true);
 *     annotate?: Array<'Ea' | 'deltaH'> ([]); annotateValues?: boolean (false) }
 *
 * titration_curve — pH against volume of titrant, computed from the chemistry
 *   { analyte: { type: 'strong_acid' | 'weak_acid' | 'strong_base' | 'weak_base';
 *                concentration: number (mol/L); volume: number (mL);
 *                pKa?: number (weak_acid); pKb?: number (weak_base) };
 *     titrantConcentration: number (mol/L; strong base for an acid, strong acid for a base);
 *     maxVolume?: number (mL; default ≈ 2 × equivalence);
 *     mark?: Array<'equivalence' | 'half_equivalence'> ([] — a dot and guide lines, no numbers);
 *     points?: Array<{ volume: number (mL); label?: string }> }   // ≤ 6 dots ON the curve at those
 *                                         //   volumes, each with its letter ("A", "B") — no numbers
 *
 * slope_field
 *   { expr: string (dy/dx in x and y) | samples: Array<{ x; y; slope } | [x, y, slope]>;
 *     xRange: [min, max]; yRange: [min, max];
 *     gridStep?: number | [xStep, yStep]; xStep?: number; yStep?: number   // numbered ticks
 *     solutionThrough?: [x, y] (needs expr); showExpression?: boolean (false) }
 *   The lattice covers xRange × yRange exactly; the plot is drawn half a
 *   cell larger on every side so no segment is cut by the border.
 *
 * free_body_diagram — the board tool's own input (FreeBodyDiagramProps)
 *   { object: { shape?: 'box' | 'circle' | 'person'; label?: string; mass?: string };
 *     surface?: { type: 'horizontal' | 'inclined' | 'vertical' | 'none'; angle?: number; friction?: boolean };
 *     forces: Array<{ name: string; magnitude?: string; direction: FbdDirection | number;
 *                     color?: string; scale?: number }> }
 *
 * FURTHER KINDS (batch 1, 2026-10-09 — see `BATCH1_FIGURE_KINDS` below; the
 * params of each are documented at the top of its module under ./kinds):
 * unit_circle, vector_diagram, free_body_diagram_v2, shaded_region,
 * number_line, sign_chart, distribution_curve, histogram, box_plot,
 * polar_complex, punnett_square, pedigree. Each has options that hide the
 * very thing a question asks for (a coordinate, a resultant, a force's size,
 * a sign, an area, a cell — drawn as a dashed "?" box where a blank is meant).
 *
 * Every marked point, endpoint and vertex dot is drawn LAST, unclipped, on a
 * thin white ring — above the curves, the grid and the axes.
 * `checkFigureLegibility(spec)` (legibility.ts) reports what a reader would
 * trip over (a curve cut to a stub, a mark on the border, overlapping
 * labels, more than four curves) without changing the picture.
 *
 * Deterministic: the same spec always gives the same string. Pure apart from
 * `renderToStaticMarkup` for the one board-rendered kind. Not imported by any
 * serving path (those need svg-safety.ts only).
 */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import FreeBodyDiagramRenderer, { type FreeBodyDiagramProps } from '@/app/tutor/components/whiteboard/FreeBodyDiagramRenderer';
import { smoothPath } from '@/app/tutor/components/whiteboard/_smoothPath';
import { solveBarChart } from '../diagrams/catalog/kinds/bar-chart';
import { solveLinePlot } from '../diagrams/catalog/kinds/line-plot';
import { compileExpression } from './expr';
import { slopeFieldSamples, slopeFieldSolution, type SlopeSample } from './slope-field';
import { validateFigureSvg } from './svg-safety';
import { sampleCurve } from './sample';
import { renderUnitCircle } from './kinds/unit-circle';
import { renderVectorDiagram } from './kinds/vector-diagram';
import { renderFreeBody } from './kinds/free-body';
import { renderShadedRegion } from './kinds/shaded-region';
import { renderNumberLine, renderSignChart } from './kinds/number-line';
import { renderBoxPlot, renderDistributionCurve, renderHistogram } from './kinds/distribution';
import { renderPolarComplex } from './kinds/polar-complex';
import { renderPunnett } from './kinds/punnett';
import { renderPedigree } from './kinds/pedigree';
import { HALO, PracticeFigureSpecError, Reader, type Drawn, type FigureFacts, type Params, type PracticeFigureSpec } from './spec';
import {
  FIGURE_FONT,
  FIGURE_WIDTH,
  GUIDE_COLOR,
  GUIDE_DASH,
  GUIDE_MASK_WIDTH,
  GUIDE_WIDTH,
  INK,
  LABEL_FS,
  MUTED,
  SERIES_COLORS,
  SERIES_SHAPES,
  TICK_FS,
  TITLE_FS,
  assignDashes,
  buildFrame,
  buildLegend,
  dashAttr,
  esc,
  estWidth,
  n2,
  niceBounds,
  niceStep,
  shapeMark,
  svgDocument,
  ticksBetween,
  tickText,
  tickTexts,
  wrapText,
  type Frame,
  type LegendEntry,
} from './plot-frame';
import { BATCH2_FIGURE_KINDS, renderBatch2, type Batch2FigureKind } from './kinds/batch2';

export const PRACTICE_FIGURE_KINDS = [
  'function_graph',
  'motion_graph',
  'bar_chart',
  'line_plot',
  'scatter_plot',
  'reaction_coordinate',
  'titration_curve',
  'slope_field',
  'free_body_diagram',
] as const;
export type PracticeFigureKind = (typeof PRACTICE_FIGURE_KINDS)[number];

/**
 * Batch 1 of the further kinds (2026-10-09) — drawn by the modules under
 * ./kinds, each a pure function of a typed, documented params object (the
 * params of each are documented at the top of its module):
 *   unit_circle (kinds/unit-circle.ts) · vector_diagram (kinds/vector-diagram.ts) ·
 *   free_body_diagram_v2 (kinds/free-body.ts) · shaded_region (kinds/shaded-region.ts) ·
 *   number_line, sign_chart (kinds/number-line.ts) ·
 *   distribution_curve, histogram, box_plot (kinds/distribution.ts) ·
 *   polar_complex (kinds/polar-complex.ts) · punnett_square (kinds/punnett.ts) ·
 *   pedigree (kinds/pedigree.ts).
 * Kept apart from `PRACTICE_FIGURE_KINDS` on purpose: that list is what the
 * practice-extension job offers its writer model (figure-prompts.ts), and a
 * kind belongs there only once the job has prompts and a review for it.
 * `renderPracticeFigure` draws every kind of both lists.
 */
export const BATCH1_FIGURE_KINDS = [
  'unit_circle',
  'vector_diagram',
  'free_body_diagram_v2',
  'shaded_region',
  'number_line',
  'sign_chart',
  'distribution_curve',
  'histogram',
  'box_plot',
  'polar_complex',
  'punnett_square',
  'pedigree',
] as const;
export type Batch1FigureKind = (typeof BATCH1_FIGURE_KINDS)[number];
export const ALL_PRACTICE_FIGURE_KINDS = [...PRACTICE_FIGURE_KINDS, ...BATCH1_FIGURE_KINDS] as const;
export type AnyPracticeFigureKind = PracticeFigureKind | Batch1FigureKind;

export { PracticeFigureSpecError, type FigureFacts, type PracticeFigureSpec } from './spec';
/** Batch 2 (2026-10-09): circuit_diagram, phylogenetic_tree, geometric_figure, ray_diagram,
 *  field_diagram, flow_diagram, solid_3d, spectrum — drawn by ./kinds/batch2.ts and the modules it
 *  names (params documented at the top of each). Kept out of `ALL_PRACTICE_FIGURE_KINDS` for the
 *  reason batch 1 is kept out of `PRACTICE_FIGURE_KINDS`; `renderPracticeFigure` draws them all. */
export { BATCH2_FIGURE_KINDS, type Batch2FigureKind };
export { sampleCurve };

/** Short stable id prefix from the spec (FNV-1a) — see the module header. */
function specUid(spec: PracticeFigureSpec): string {
  const s = JSON.stringify(spec);
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return `pf${h.toString(36)}`;
}

function clipDef(uid: string, f: Frame): string {
  return `<defs><clipPath id="${uid}-clip"><rect x="${n2(f.plot.x)}" y="${n2(f.plot.y)}" width="${n2(f.plot.w)}" height="${n2(f.plot.h)}"/></clipPath></defs>`;
}

function polyline(pts: ReadonlyArray<readonly [number, number]>, f: Frame): string {
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${n2(f.X(x))},${n2(f.Y(y))}`).join('');
}

/** A text label next to a point, kept inside the figure and off the point. */
function pointLabel(text: string, px: number, py: number, f: Frame): string {
  const w = estWidth(text, TICK_FS);
  const right = px + 7 + w <= f.W - 3;
  const above = py - 8 - TICK_FS >= f.plot.y - 6;
  const x = right ? px + 7 : px - 7;
  const y = above ? py - 7 : py + TICK_FS + 6;
  return `<text x="${n2(x)}" y="${n2(y)}" font-size="${TICK_FS}" font-weight="600" text-anchor="${right ? 'start' : 'end'}" fill="${INK}" ${HALO}>${esc(text)}</text>`;
}

// ---------------------------------------------------------------------------
// function_graph
// ---------------------------------------------------------------------------

/** The white disc under a mark: a thin ring of clear paper round it, so a
 *  point on a gridline, an axis or the plot border still reads as a point. */
function markHalo(cx: number, cy: number, r = 5.9): string {
  return `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="#ffffff"/>`;
}

function endpointMark(x: number, y: number, kind: 'open' | 'closed', color: string, f: Frame): string {
  return `<circle cx="${n2(f.X(x))}" cy="${n2(f.Y(y))}" r="3.8" fill="${kind === 'open' ? '#ffffff' : color}" stroke="${color}" stroke-width="1.8"/>`;
}

/** `xTickUnit: 'pi'` (+ `xTickDivisor`) → the π divisor for the frame. */
function piDivisor(r: Reader, axis: 'x' | 'y'): number | undefined {
  const unit = r.p[`${axis}TickUnit`];
  const div = r.p[`${axis}TickDivisor`];
  if (unit === undefined || unit === null) {
    if (div !== undefined && div !== null) r.fail(`${axis}TickDivisor needs ${axis}TickUnit: 'pi'`);
    return undefined;
  }
  if (unit !== 'pi') r.fail(`${axis}TickUnit must be 'pi'`);
  if (r.p[`${axis}Step`] !== undefined && r.p[`${axis}Step`] !== null) r.fail(`give ${axis}Step or ${axis}TickUnit, not both`);
  const d = div === undefined || div === null ? 1 : r.num(div, `${axis}TickDivisor`);
  if (!Number.isInteger(d) || d < 1 || d > 12) r.fail(`${axis}TickDivisor must be a whole number from 1 to 12`);
  return d;
}

type EndFlag = 'open' | 'closed' | 'none' | undefined;

interface CurvePiece {
  fn: (x: number) => number;
  /** The part of the domain inside xRange. */
  a: number;
  b: number;
  /** The domain ends as the spec gave them. */
  d0?: number;
  d1?: number;
  from: EndFlag;
  to: EndFlag;
  group: number;
}

function renderFunctionGraph(r: Reader, uid: string): Drawn {
  const p = r.p;
  const xRange = r.range(p.xRange, 'xRange');
  const yRange = r.range(p.yRange, 'yRange');
  const curvesIn = p.curves === undefined ? [] : r.list(p.curves, 'curves', 0, 6);
  const pointsIn = p.points === undefined ? [] : r.list(p.points, 'points', 0, 24);
  const asymptotesIn = p.asymptotes === undefined ? [] : r.list(p.asymptotes, 'asymptotes', 0, 8);
  if (curvesIn.length === 0 && pointsIn.length === 0) r.fail('needs at least one curve or point');
  const spanX = xRange[1] - xRange[0];
  const spanY = yRange[1] - yRange[0];
  const f = buildFrame({
    xRange,
    yRange,
    xStep: r.optStep(p.xStep, 'xStep'),
    yStep: r.optStep(p.yStep, 'yStep'),
    xPiDivisor: piDivisor(r, 'x'),
    yPiDivisor: piDivisor(r, 'y'),
    xLabel: r.optStr(p.xLabel, 'xLabel') ?? 'x',
    yLabel: r.optStr(p.yLabel, 'yLabel') ?? 'y',
    title: r.optStr(p.title, 'title', 160),
    // Equal ranges ⇒ square cells, so a slope reads true off the grid.
    aspect: Math.max(0.6, Math.min(1.25, spanY / spanX)),
    commonStep: true,
  });
  const parts: string[] = [clipDef(uid, f), f.svg];
  const legend: LegendEntry[] = [];
  const clipped: string[] = [];
  // Drawn last, unclipped, in this order: white discs, marks, then text.
  const halos: string[] = [];
  const marks: string[] = [];
  const labels: string[] = [];
  const facts: FigureFacts = { plot: f.plot, curveCount: 0, marks: [], curves: [] };
  /** Labels of asymptotes, placed after the curves are sampled so none is set on a curve. */
  interface GuideSpot { x: number; y: number; anchor: 'start' | 'end'; w: number }
  const guideLabels: Array<{ slot: number; text: string; spots: GuideSpot[]; fallback: string }> = [];
  /** Every sampled curve point, on the canvas. */
  const curvePx: Array<[number, number]> = [];

  asymptotesIn.forEach((raw, i) => {
    const a = r.obj(raw, `asymptotes[${i}]`);
    const label = r.optStr(a.label, `asymptotes[${i}].label`, 24);
    // A guide, not a curve: dark grey, long-dashed, thinner than a curve — no curve pattern looks
    // like it. Each is drawn twice: a white under-line first, which hides a gridline (or an axis)
    // lying exactly under it, then the dashes — so the gaps are clear paper and the dashes read.
    const mask = `stroke="#ffffff" stroke-width="${GUIDE_MASK_WIDTH}"`;
    const stroke = `stroke="${GUIDE_COLOR}" stroke-width="${GUIDE_WIDTH}" stroke-dasharray="${GUIDE_DASH}"`;
    if (a.x !== undefined) {
      const x = r.num(a.x, `asymptotes[${i}].x`);
      const at = `x1="${n2(f.X(x))}" y1="${n2(f.plot.y)}" x2="${n2(f.X(x))}" y2="${n2(f.plot.y + f.plot.h)}"`;
      clipped.push(`<line ${at} ${mask}/><line ${at} ${stroke}/>`);
      if (label) {
        // Placed once the curves are known (see `guideLabels`): beside the top of the line, on the
        // right — or the left, or at the bottom, when the curve runs up that side of it.
        const w = estWidth(label, TICK_FS);
        const px = f.X(x);
        const spots: GuideSpot[] = [];
        for (const top of [true, false]) for (const right of [px + 5 + w <= f.W - 3, !(px + 5 + w <= f.W - 3)]) {
          const ty = top ? f.plot.y + TICK_FS + 5 : f.plot.y + f.plot.h - 7;
          if (!right && px - 5 - w < f.plot.x + 2) continue;
          spots.push({ x: right ? px + 5 : px - 5, y: ty, anchor: right ? 'start' : 'end', w });
        }
        guideLabels.push({ slot: labels.length, text: label, spots, fallback: pointLabel(label, px - 2, f.plot.y + TICK_FS + 12, f) });
        labels.push('');
      }
    } else if (a.y !== undefined) {
      const y = r.num(a.y, `asymptotes[${i}].y`);
      const at = `x1="${n2(f.plot.x)}" y1="${n2(f.Y(y))}" x2="${n2(f.plot.x + f.plot.w)}" y2="${n2(f.Y(y))}"`;
      clipped.push(`<line ${at} ${mask}/><line ${at} ${stroke}/>`);
      if (label) {
        const w = estWidth(label, TICK_FS);
        const py = f.Y(y);
        const spots: GuideSpot[] = [];
        for (const right of [true, false]) for (const above of [py - 4 - TICK_FS >= f.plot.y + 1, !(py - 4 - TICK_FS >= f.plot.y + 1)]) {
          spots.push({ x: right ? f.plot.x + f.plot.w - 4 : f.plot.x + 4, y: above ? py - 4 : py + TICK_FS + 2, anchor: right ? 'end' : 'start', w });
        }
        guideLabels.push({ slot: labels.length, text: label, spots, fallback: `<text x="${n2(f.plot.x + f.plot.w - 4)}" y="${n2(py - 4)}" font-size="${TICK_FS}" font-weight="600" text-anchor="end" fill="${INK}" ${HALO}>${esc(label)}</text>` });
        labels.push('');
      }
    } else r.fail(`asymptotes[${i}] needs x or y`);
  });

  // Pass 1 — read every entry and decide which are pieces of ONE function.
  const pieces: CurvePiece[] = [];
  const groups: Array<{ color: string; dashed: boolean; label?: string }> = [];
  const eps = spanX * 1e-9;
  curvesIn.forEach((raw, i) => {
    const c = r.obj(raw, `curves[${i}]`);
    let fn: (x: number) => number;
    try {
      fn = compileExpression(c.expr, ['x']);
    } catch (err) {
      return r.fail(`curves[${i}].expr: ${(err as Error).message}`);
    }
    const dashed = r.bool(c.dashed, `curves[${i}].dashed`, false);
    let a = xRange[0];
    let b = xRange[1];
    let d0: number | undefined;
    let d1: number | undefined;
    if (c.domain !== undefined && c.domain !== null) {
      const d = c.domain as unknown[];
      if (!Array.isArray(d) || d.length !== 2) r.fail(`curves[${i}].domain must be [min | null, max | null]`);
      d0 = r.optNum(d[0], `curves[${i}].domain[0]`);
      d1 = r.optNum(d[1], `curves[${i}].domain[1]`);
      if (d0 !== undefined && d1 !== undefined && !(d1 > d0)) r.fail(`curves[${i}].domain must have max greater than min`);
      if (d0 !== undefined) a = Math.max(a, d0);
      if (d1 !== undefined) b = Math.min(b, d1);
    }
    if (!(b > a)) r.fail(`curves[${i}].domain lies outside xRange`);
    const flag = (which: 'from' | 'to', at: number | undefined): EndFlag => {
      const kind = c[which];
      if (kind === undefined || kind === null) return undefined;
      if (kind !== 'open' && kind !== 'closed' && kind !== 'none') r.fail(`curves[${i}].${which} must be 'open', 'closed' or 'none'`);
      if (kind !== 'none' && at === undefined) r.fail(`curves[${i}].${which} needs that end of domain to be a number`);
      return kind as EndFlag;
    };
    const label = r.optStr(c.label, `curves[${i}].label`, 40);
    const own = r.color(c.color, '');
    // The same function, continued: said outright (`continues`), or an
    // unnamed entry in the same colour whose domain does not overlap the
    // pieces before it — the branch after a hole or a jump. It must not come
    // out as a second, unexplained curve.
    const says = c.continues === undefined || c.continues === null ? undefined : r.bool(c.continues, `curves[${i}].continues`, false);
    if (says === true && i === 0) r.fail('curves[0].continues: there is no curve before it to continue');
    let group = -1;
    if (i > 0 && says !== false) {
      const g = pieces[i - 1].group;
      const apart = pieces.filter((q) => q.group === g).every((q) => b <= q.a + eps || a >= q.b - eps);
      if (says === true || (!label && apart && (!own || own.toLowerCase() === groups[g].color.toLowerCase()))) group = g;
    }
    if (group < 0) {
      group = groups.length;
      groups.push({ color: own || SERIES_COLORS[group % SERIES_COLORS.length], dashed, label });
    } else {
      groups[group].dashed = groups[group].dashed || dashed;
      groups[group].label = groups[group].label ?? label;
    }
    pieces.push({ fn, a, b, d0, d1, from: flag('from', d0), to: flag('to', d1), group });
  });
  const dashes = assignDashes(groups.map((g) => g.dashed));
  facts.curveCount = groups.length;
  const seen = groups.map(() => ({ visible: 0, total: 0, stubs: 0 }));

  /** Where an end of a piece is, when it is inside the plot. */
  const endPoint = (pc: CurvePiece, i: number, which: 'from' | 'to', explicit: boolean): [number, number] | null => {
    const x = which === 'from' ? pc.d0 : pc.d1;
    if (x === undefined || x < xRange[0] || x > xRange[1]) return null;
    let y = pc.fn(x);
    if (!Number.isFinite(y)) y = pc.fn(x + (which === 'from' ? 1 : -1) * spanX * 1e-9);
    if (!Number.isFinite(y)) return explicit ? r.fail(`curves[${i}].${which}: the curve has no value at x = ${x}`) : null;
    return y < yRange[0] || y > yRange[1] ? null : [x, y];
  };

  // Pass 2 — draw.
  pieces.forEach((pc, i) => {
    const { color } = groups[pc.group];
    const sampled = sampleCurve(pc.fn, pc.a, pc.b, yRange[0], yRange[1]);
    if (sampled.length === 0) r.fail(`curves[${i}].expr is undefined across its whole domain`);
    const d = sampled.map((branch) => polyline(branch, f)).join('');
    for (const branch of sampled) for (const [bx, by] of branch) curvePx.push([f.X(bx), f.Y(by)]);
    clipped.push(`<path d="${d}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"${dashAttr(dashes[pc.group])}/>`);
    // How much of it the y-range lets through (legibility report only).
    const acc = seen[pc.group];
    acc.total += pc.b - pc.a;
    for (const branch of sampled) {
      let vis = 0;
      for (let k = 1; k < branch.length; k++) {
        const inside = (q: [number, number]) => q[1] >= yRange[0] && q[1] <= yRange[1];
        if (inside(branch[k - 1]) && inside(branch[k])) vis += branch[k][0] - branch[k - 1][0];
      }
      acc.visible += vis;
      const extent = branch[branch.length - 1][0] - branch[0][0];
      if (vis < spanX * 0.04 && extent > vis * 1.5) acc.stubs++;
    }
    // End marks sit exactly on the domain end, at the one-sided limit. An end
    // the spec flags is drawn as flagged. An unflagged end that stops INSIDE
    // the plot is an included endpoint (a filled dot) — unless the next piece
    // of the same function carries straight on from it. A curve that simply
    // leaves the plot (through a side, the top or the bottom) has no mark.
    (['from', 'to'] as const).forEach((which) => {
      const kind = pc[which];
      if (kind === 'none') return;
      const at = endPoint(pc, i, which, kind !== undefined);
      if (!at) return;
      if (kind === undefined) {
        if (!(at[0] > xRange[0] + eps && at[0] < xRange[1] - eps)) return;
        const carriesOn = pieces.some((q, j) => j !== i && q.group === pc.group && (['from', 'to'] as const).some((w) => {
          if (q[w] !== undefined) return false;
          const other = endPoint(q, j, w, false);
          return !!other && Math.abs(other[0] - at[0]) <= eps && Math.abs(other[1] - at[1]) <= spanY * 1e-6;
        }));
        if (carriesOn) return;
      }
      halos.push(markHalo(f.X(at[0]), f.Y(at[1])));
      marks.push(endpointMark(at[0], at[1], kind === 'open' ? 'open' : 'closed', color, f));
      facts.marks.push({ what: `curves[${i}].${which}`, cx: f.X(at[0]), cy: f.Y(at[1]) });
    });
  });
  // The asymptote labels: the first spot no curve passes through (and no label before it took).
  const taken: Array<{ x0: number; y0: number; x1: number; y1: number }> = [];
  for (const g of guideLabels) {
    const boxOf = (sp: GuideSpot) => ({ x0: (sp.anchor === 'end' ? sp.x - sp.w : sp.x) - 2, y0: sp.y - TICK_FS * 0.85 - 1, x1: (sp.anchor === 'end' ? sp.x : sp.x + sp.w) + 2, y1: sp.y + 3 });
    const clearOf = (sp: GuideSpot): boolean => {
      const b = boxOf(sp);
      if (taken.some((q) => b.x0 < q.x1 && q.x0 < b.x1 && b.y0 < q.y1 && q.y0 < b.y1)) return false;
      // Between two samples a steep curve can step over the box: test the joins as well.
      for (let k = 0; k < curvePx.length; k++) {
        const [cx, cy] = curvePx[k];
        if (cx > b.x0 && cx < b.x1 && cy > b.y0 && cy < b.y1) return false;
        if (k > 0) {
          const [qx, qy] = curvePx[k - 1];
          if (Math.abs(cx - qx) < 12 && Math.min(cx, qx) < b.x1 && Math.max(cx, qx) > b.x0 && Math.min(cy, qy) < b.y0 && Math.max(cy, qy) > b.y1) return false;
        }
      }
      return true;
    };
    const first = g.spots[0];
    const sp = g.spots.find(clearOf);
    // The first spot, when clear, is drawn exactly as it always was.
    if (!sp || sp === first) {
      labels[g.slot] = g.fallback;
      if (first) taken.push(boxOf(first));
      continue;
    }
    taken.push(boxOf(sp));
    labels[g.slot] = `<text x="${n2(sp.x)}" y="${n2(sp.y)}" font-size="${TICK_FS}" font-weight="600" text-anchor="${sp.anchor}" fill="${INK}" ${HALO}>${esc(g.text)}</text>`;
  }
  groups.forEach((g, k) => {
    if (g.label) legend.push({ label: g.label, color: g.color, dashed: g.dashed, dash: dashes[k] });
    const first = pieces.findIndex((pc) => pc.group === k);
    facts.curves.push({ what: g.label ? `curve "${g.label}"` : `curves[${first}]`, visibleFraction: seen[k].total > 0 ? seen[k].visible / seen[k].total : 1, stubs: seen[k].stubs });
  });

  pointsIn.forEach((raw, i) => {
    const pt = r.obj(raw, `points[${i}]`);
    const x = r.num(pt.x, `points[${i}].x`);
    const y = r.num(pt.y, `points[${i}].y`);
    if (x < xRange[0] || x > xRange[1] || y < yRange[0] || y > yRange[1]) r.fail(`points[${i}] lies outside the ranges`);
    const open = r.bool(pt.open, `points[${i}].open`, false);
    const color = r.color(pt.color, INK);
    halos.push(markHalo(f.X(x), f.Y(y)));
    marks.push(endpointMark(x, y, open ? 'open' : 'closed', color, f));
    facts.marks.push({ what: `points[${i}]`, cx: f.X(x), cy: f.Y(y) });
    const label = r.optStr(pt.label, `points[${i}].label`, 24);
    if (label) labels.push(pointLabel(label, f.X(x), f.Y(y), f));
  });

  parts.push(`<g clip-path="url(#${uid}-clip)">${clipped.join('')}</g>`, halos.join(''), marks.join(''), labels.join(''));
  const lg = buildLegend(legend, f.bottom);
  parts.push(lg.svg);
  return { body: parts.join(''), H: f.bottom + lg.height, facts };
}

// ---------------------------------------------------------------------------
// motion_graph
// ---------------------------------------------------------------------------

const MOTION_Y_LABEL = {
  position: 'Position (m)',
  velocity: 'Velocity (m/s)',
  acceleration: 'Acceleration (m/s²)',
} as const;

function readXY(r: Reader, raw: unknown, name: string, xKey: string, yKey: string): [number, number] {
  if (Array.isArray(raw)) return [r.num(raw[0], `${name}[0]`), r.num(raw[1], `${name}[1]`)];
  const o = r.obj(raw, name);
  return [r.num(o[xKey], `${name}.${xKey}`), r.num(o[yKey], `${name}.${yKey}`)];
}

function renderMotionGraph(r: Reader, uid: string): Drawn {
  const p = r.p;
  const quantity = (p.quantity ?? 'position') as keyof typeof MOTION_Y_LABEL;
  if (!(quantity in MOTION_Y_LABEL)) r.fail(`quantity must be one of ${Object.keys(MOTION_Y_LABEL).join(', ')}`);
  const interpolation = p.interpolation ?? 'linear';
  if (interpolation !== 'linear' && interpolation !== 'smooth') r.fail(`interpolation must be 'linear' or 'smooth'`);
  const showPoints = r.bool(p.showPoints, 'showPoints', false);
  const seriesIn = p.series !== undefined ? r.list(p.series, 'series', 1, 4) : [{ points: p.points }];
  const series = seriesIn.map((raw, i) => {
    const s = r.obj(raw, `series[${i}]`);
    const pts = r.list(s.points, `series[${i}].points`, 2, 200)
      .map((pt, j) => readXY(r, pt, `series[${i}].points[${j}]`, 't', 'value'))
      .sort((a, b) => a[0] - b[0]);
    const vertexDots = s.vertexDots === undefined || s.vertexDots === null ? undefined : s.vertexDots;
    if (vertexDots !== undefined && vertexDots !== 'all' && vertexDots !== 'ends' && vertexDots !== 'none') r.fail(`series[${i}].vertexDots must be 'all', 'ends' or 'none'`);
    return {
      pts,
      label: r.optStr(s.label, `series[${i}].label`, 40),
      color: r.color(s.color, SERIES_COLORS[i % SERIES_COLORS.length]),
      dashed: r.bool(s.dashed, `series[${i}].dashed`, false),
      vertexDots: vertexDots as 'all' | 'ends' | 'none' | undefined,
    };
  });
  const all = series.flatMap((s) => s.pts);
  const tMin = Math.min(...all.map((q) => q[0]));
  const tMax = Math.max(...all.map((q) => q[0]));
  const vMin = Math.min(...all.map((q) => q[1]));
  const vMax = Math.max(...all.map((q) => q[1]));
  // Time starts on a gridline; the value axis always shows zero (rest, the
  // origin, a change of direction are all read against it).
  const tB = niceBounds(tMin, tMax, 8);
  const yB = niceBounds(Math.min(vMin, 0), Math.max(vMax, 0), 8);
  const tRange = r.optRange(p.tRange, 'tRange') ?? [tB.min, tB.max];
  const yRange = r.optRange(p.yRange, 'yRange') ?? [yB.min, yB.max];
  const f = buildFrame({
    xRange: tRange,
    yRange,
    xStep: r.optStep(p.tStep, 'tStep') ?? (p.tRange === undefined ? tB.step : undefined),
    yStep: r.optStep(p.yStep, 'yStep') ?? (p.yRange === undefined ? yB.step : undefined),
    xLabel: r.optStr(p.tLabel, 'tLabel') ?? 'Time (s)',
    yLabel: r.optStr(p.yLabel, 'yLabel') ?? MOTION_Y_LABEL[quantity],
    title: r.optStr(p.title, 'title', 160),
    aspect: 0.78,
  });
  const clipped: string[] = [];
  // Vertex dots go on top of everything, unclipped: one on the plot border
  // (a graph that starts at the origin) is drawn whole, on a white ring.
  const dots: string[] = [];
  const legend: LegendEntry[] = [];
  const facts: FigureFacts = { plot: f.plot, curveCount: series.length, marks: [], curves: [] };
  const dashes = assignDashes(series.map((s) => s.dashed));
  const inPlot = ([x, y]: [number, number]) => x >= tRange[0] && x <= tRange[1] && y >= yRange[0] && y <= yRange[1];
  const inside = ([x, y]: [number, number]) => x > tRange[0] && x < tRange[1] && y >= yRange[0] && y <= yRange[1];
  series.forEach((s, i) => {
    const d = interpolation === 'smooth'
      ? smoothPath(s.pts.map(([x, y]) => ({ x, y })), f.X, f.Y)
      : polyline(s.pts, f);
    clipped.push(`<path d="${d}" fill="none" stroke="${s.color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"${dashAttr(dashes[i])}/>`);
    // 'all' — every vertex (what showPoints gives); 'ends' — the first and
    // last only, so a corner the question asks about is not given away;
    // 'none'. Without either switch a line that stops INSIDE the plot still
    // ends in a dot; one that runs to the border does not.
    const mode = s.vertexDots ?? (showPoints ? 'all' : 'auto');
    const last = s.pts.length - 1;
    s.pts.forEach((pt, j) => {
      facts.marks.push({ what: `series[${i}].points[${j}]`, cx: f.X(pt[0]), cy: f.Y(pt[1]) });
      const isEnd = j === 0 || j === last;
      const draw = mode === 'all' ? inPlot(pt) : mode === 'ends' ? isEnd && inPlot(pt) : mode === 'auto' ? isEnd && inside(pt) : false;
      if (draw) dots.push(`<circle cx="${n2(f.X(pt[0]))}" cy="${n2(f.Y(pt[1]))}" r="3.2" fill="${s.color}" stroke="#ffffff" stroke-width="1.2"/>`);
    });
    if (s.label) legend.push({ label: s.label, color: s.color, dashed: s.dashed, dash: dashes[i] });
  });
  const lg = buildLegend(legend, f.bottom);
  return { body: `${clipDef(uid, f)}${f.svg}<g clip-path="url(#${uid}-clip)">${clipped.join('')}</g>${dots.join('')}${lg.svg}`, H: f.bottom + lg.height, facts };
}

// ---------------------------------------------------------------------------
// bar_chart
// ---------------------------------------------------------------------------

const ROT = 40; // degrees, for category labels that do not fit their column
const MAX_CAT_CHARS = 28;

function renderBarChart(r: Reader): Drawn {
  const p = r.p;
  const cats = r.list(p.categories, 'categories', 1, 24).map((c, i) => r.str(c, `categories[${i}]`, 60));
  let fig;
  try {
    // The board's solver: validation + a round value axis that includes zero.
    fig = solveBarChart({ categories: cats, values: p.values });
  } catch (err) {
    return r.fail((err as Error).message.replace(/^bar_chart:\s*/, ''));
  }
  const yMin = r.optNum(p.yMin, 'yMin') ?? fig.yMin;
  const yMax = r.optNum(p.yMax, 'yMax') ?? fig.yMax;
  if (!(yMax > yMin)) r.fail('yMax must be greater than yMin');
  if (fig.values.some((v) => v < yMin || v > yMax)) r.fail('a value lies outside yMin..yMax');
  const yStep = r.optStep(p.yStep, 'yStep') ?? (p.yMin === undefined && p.yMax === undefined ? fig.yStep : undefined);
  const showValues = r.bool(p.showValues, 'showValues', false);
  const colors = Array.isArray(p.colors) ? (p.colors as unknown[]) : [];
  const n = cats.length;
  const base = {
    xRange: [0, n] as [number, number],
    yRange: [yMin, yMax] as [number, number],
    yStep,
    yLabel: r.optStr(p.yLabel, 'yLabel'),
    title: r.optStr(p.title, 'title', 160),
    aspect: 0.72,
    xNumbers: false,
  };
  const xLabel = r.optStr(p.xLabel, 'xLabel');
  // First pass for the real column width; then decide how labels are set.
  let f = buildFrame(base);
  let col = f.plot.w / n;
  const flat = cats.map((c) => wrapText(c, col - 4, TICK_FS));
  const fits = flat.every((lines) => lines.length <= 3 && lines.every((l) => estWidth(l, TICK_FS) <= col - 2));
  const shown = cats.map((c) => (c.length > MAX_CAT_CHARS ? `${c.slice(0, MAX_CAT_CHARS - 1)}…` : c));
  const rad = (ROT * Math.PI) / 180;
  let bottomExtra: number;
  let minLeft = 0;
  if (fits) {
    bottomExtra = Math.max(...flat.map((l) => l.length)) * (TICK_FS + 2) + 6;
  } else {
    const widest = Math.max(...shown.map((c) => estWidth(c, TICK_FS)));
    bottomExtra = widest * Math.sin(rad) + TICK_FS + 8;
    // A rotated label runs down-left from its column: keep the first ones inside the figure.
    shown.forEach((c, i) => {
      minLeft = Math.max(minLeft, estWidth(c, TICK_FS) * Math.cos(rad) + 6 - (i + 0.5) * col);
    });
    minLeft += f.plot.x > minLeft ? 0 : 2;
  }
  f = buildFrame({ ...base, bottomExtra, minLeft: Math.ceil(minLeft) });
  col = f.plot.w / n;
  const parts: string[] = [f.svg];
  const barW = col * 0.68;
  const zeroY = f.Y(Math.max(yMin, Math.min(yMax, 0)));
  fig.values.forEach((v, i) => {
    const cx = f.plot.x + (i + 0.5) * col;
    const yv = f.Y(v);
    const top = Math.min(yv, zeroY);
    const h = Math.max(Math.abs(yv - zeroY), 0.8);
    const color = r.color(colors[i], SERIES_COLORS[0]);
    parts.push(`<rect x="${n2(cx - barW / 2)}" y="${n2(top)}" width="${n2(barW)}" height="${n2(h)}" fill="${color}"/>`);
    if (showValues) {
      const ty = v >= 0 ? top - 4 : top + h + TICK_FS + 1;
      parts.push(`<text x="${n2(cx)}" y="${n2(ty)}" font-size="${TICK_FS}" font-weight="600" text-anchor="middle" fill="${INK}" ${HALO}>${esc(tickText(v, 10 ** -decimalsOf(v)))}</text>`);
    }
    const ly = f.plot.y + f.plot.h + TICK_FS + 3;
    if (fits) {
      flat[i].forEach((line, k) => {
        parts.push(`<text x="${n2(cx)}" y="${n2(ly + k * (TICK_FS + 2))}" font-size="${TICK_FS}" text-anchor="middle" fill="${INK}">${esc(line)}</text>`);
      });
    } else {
      parts.push(`<text x="${n2(cx + 3)}" y="${n2(ly - 2)}" font-size="${TICK_FS}" text-anchor="end" fill="${INK}" transform="rotate(-${ROT} ${n2(cx + 3)} ${n2(ly - 2)})">${esc(shown[i])}</text>`);
    }
  });
  // The baseline over the bars' feet.
  parts.push(`<line x1="${n2(f.plot.x)}" y1="${n2(zeroY)}" x2="${n2(f.plot.x + f.plot.w)}" y2="${n2(zeroY)}" stroke="${INK}" stroke-width="1.4"/>`);
  let H = f.bottom;
  if (xLabel) {
    parts.push(`<text x="${n2(f.plot.x + f.plot.w / 2)}" y="${n2(H + LABEL_FS - 2)}" font-size="${LABEL_FS}" font-weight="600" text-anchor="middle" fill="${INK}">${esc(xLabel)}</text>`);
    H += LABEL_FS + 8;
  }
  return { body: parts.join(''), H };
}

function decimalsOf(v: number): number {
  const s = String(Math.round(v * 1000) / 1000);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

// ---------------------------------------------------------------------------
// line_plot (dot plot)
// ---------------------------------------------------------------------------

function renderLinePlot(r: Reader): Drawn {
  const p = r.p;
  let values: number[];
  try {
    // The board's solver validates the data; the axis below is laid out to scale.
    solveLinePlot({ values: p.values });
    values = (p.values as number[]).slice();
  } catch (err) {
    return r.fail((err as Error).message.replace(/^line_plot:\s*/, ''));
  }
  if (values.length > 400) r.fail('values has more than 400 entries');
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const isMultiple = (s: number) => values.every((v) => Math.abs(v / s - Math.round(v / s)) < 1e-6);
  let step = r.optStep(p.step, 'step');
  if (step === undefined) {
    step = [1, 0.5, 0.25, 0.2, 0.1, 0.05, 0.01].find(isMultiple) ?? niceStep(hi - lo || 1, 10);
    // A long integer run: keep one tick per value only while they fit.
    if ((hi - lo) / step > 40) step = niceStep(hi - lo, 20);
  }
  let aMin = Math.floor(lo / step + 1e-9) * step;
  let aMax = Math.ceil(hi / step - 1e-9) * step;
  if (!(aMax > aMin)) {
    aMin -= step;
    aMax += step;
  }
  const ticks = ticksBetween(aMin, aMax, step);
  const counts = new Map<string, { v: number; n: number }>();
  for (const v of values) {
    const key = v.toPrecision(10);
    const e = counts.get(key) ?? { v, n: 0 };
    e.n++;
    counts.set(key, e);
  }
  const maxFreq = Math.max(...[...counts.values()].map((e) => e.n));
  const W = FIGURE_WIDTH;
  const padX = 22;
  const axisW = W - 2 * padX;
  const X = (v: number) => padX + ((v - aMin) / (aMax - aMin)) * axisW;
  const tickPx = axisW / (ticks.length - 1 || 1);
  // Dots as large as the spacing allows, shrinking for tall stacks.
  const rDot = Math.max(2.2, Math.min(6.5, tickPx * 0.44, 230 / (2 * maxFreq)));
  const pitch = 2 * rDot + 1.5;
  const title = r.optStr(p.title, 'title', 160);
  const titleLines = title ? wrapText(title, W - 20, TITLE_FS) : [];
  const top = titleLines.length > 0 ? 10 + titleLines.length * (TITLE_FS + 3) + 4 : 10;
  const baseY = top + maxFreq * pitch + 12;
  const parts: string[] = [];
  titleLines.forEach((line, i) => {
    parts.push(`<text x="${n2(W / 2)}" y="${n2(10 + TITLE_FS + i * (TITLE_FS + 3))}" font-size="${TITLE_FS}" font-weight="600" text-anchor="middle" fill="${INK}">${esc(line)}</text>`);
  });
  parts.push(`<line x1="${n2(padX - 12)}" y1="${n2(baseY)}" x2="${n2(W - padX + 12)}" y2="${n2(baseY)}" stroke="${INK}" stroke-width="1.6"/>`);
  parts.push(`<path d="M${n2(padX - 16)},${n2(baseY)}l7,-4v8zM${n2(W - padX + 16)},${n2(baseY)}l-7,-4v8z" fill="${INK}"/>`);
  const widest = Math.max(...ticks.map((t) => estWidth(tickText(t, step as number), TICK_FS)));
  const every = Math.max(1, Math.ceil((widest + 5) / tickPx));
  const texts = tickTexts(ticks.filter((_, i) => i % every === 0), step);
  ticks.forEach((t, i) => {
    const labelled = i % every === 0;
    parts.push(`<line x1="${n2(X(t))}" y1="${n2(baseY - (labelled ? 5 : 3))}" x2="${n2(X(t))}" y2="${n2(baseY + (labelled ? 5 : 3))}" stroke="${INK}" stroke-width="1.2"/>`);
    if (labelled) parts.push(`<text x="${n2(X(t))}" y="${n2(baseY + TICK_FS + 8)}" font-size="${TICK_FS}" text-anchor="middle" fill="${INK}">${esc(texts[i / every])}</text>`);
  });
  const dots: string[] = [];
  for (const e of [...counts.values()].sort((a, b) => a.v - b.v)) {
    for (let k = 0; k < e.n; k++) dots.push(`<circle cx="${n2(X(e.v))}" cy="${n2(baseY - 8 - rDot - k * pitch)}" r="${n2(rDot)}"/>`);
  }
  parts.push(`<g fill="${SERIES_COLORS[0]}">${dots.join('')}</g>`);
  let H = baseY + TICK_FS + 14;
  const xLabel = r.optStr(p.xLabel, 'xLabel');
  if (xLabel) {
    const lines = wrapText(xLabel, W - 20, LABEL_FS);
    lines.forEach((line, i) => {
      parts.push(`<text x="${n2(W / 2)}" y="${n2(H + LABEL_FS + i * (LABEL_FS + 2))}" font-size="${LABEL_FS}" font-weight="600" text-anchor="middle" fill="${INK}">${esc(line)}</text>`);
    });
    H += lines.length * (LABEL_FS + 2) + 6;
  }
  return { body: parts.join(''), H: H + 4 };
}

// ---------------------------------------------------------------------------
// scatter_plot
// ---------------------------------------------------------------------------

/** An axis for data: round bounds, starting at zero when the data sit near it. */
function dataBounds(lo: number, hi: number): { min: number; max: number; step: number } {
  const from = lo >= 0 && lo <= 0.35 * hi ? 0 : lo;
  const to = hi <= 0 && hi >= 0.35 * lo ? 0 : hi;
  return niceBounds(from, to, 8);
}

function renderScatterPlot(r: Reader, uid: string): Drawn {
  const p = r.p;
  const pts = r.list(p.points, 'points', 1, 300).map((raw, i) => {
    const [x, y] = readXY(r, raw, `points[${i}]`, 'x', 'y');
    const o = Array.isArray(raw) ? {} : (raw as Params);
    return { x, y, label: r.optStr(o.label, `points[${i}].label`, 24), series: r.optStr(o.series, `points[${i}].series`, 40) };
  });
  const xB = dataBounds(Math.min(...pts.map((q) => q.x)), Math.max(...pts.map((q) => q.x)));
  const yB = dataBounds(Math.min(...pts.map((q) => q.y)), Math.max(...pts.map((q) => q.y)));
  const xRange = r.optRange(p.xRange, 'xRange') ?? [xB.min, xB.max];
  const yRange = r.optRange(p.yRange, 'yRange') ?? [yB.min, yB.max];
  const f = buildFrame({
    xRange,
    yRange,
    xStep: r.optStep(p.xStep, 'xStep') ?? (p.xRange === undefined ? xB.step : undefined),
    yStep: r.optStep(p.yStep, 'yStep') ?? (p.yRange === undefined ? yB.step : undefined),
    xLabel: r.optStr(p.xLabel, 'xLabel'),
    yLabel: r.optStr(p.yLabel, 'yLabel'),
    title: r.optStr(p.title, 'title', 160),
    aspect: 0.8,
  });
  const names = [...new Set(pts.map((q) => q.series).filter((s): s is string => !!s))];
  if (names.length > SERIES_COLORS.length) r.fail(`at most ${SERIES_COLORS.length} series`);
  const colorOf = (s?: string) => SERIES_COLORS[s ? names.indexOf(s) : 0];
  // Several series: a marker shape each as well as a colour.
  const shapeOf = (s?: string) => SERIES_SHAPES[s && names.length > 1 ? names.indexOf(s) : 0];
  const clipped: string[] = [];
  const marks: string[] = [];
  const labels: string[] = [];
  const legend: LegendEntry[] = names.map((s) => ({ label: s, color: colorOf(s), mark: 'dot' as const, shape: shapeOf(s) }));
  const facts: FigureFacts = { plot: f.plot, curveCount: 0, marks: [], curves: [] };

  if (p.trendLine !== undefined && p.trendLine !== null && p.trendLine !== false) {
    let slope: number;
    let intercept: number;
    if (p.trendLine === true) {
      if (pts.length < 2) r.fail('trendLine needs at least two points');
      const mx = pts.reduce((s, q) => s + q.x, 0) / pts.length;
      const my = pts.reduce((s, q) => s + q.y, 0) / pts.length;
      const sxx = pts.reduce((s, q) => s + (q.x - mx) ** 2, 0);
      if (!(sxx > 0)) r.fail('trendLine: every point has the same x');
      slope = pts.reduce((s, q) => s + (q.x - mx) * (q.y - my), 0) / sxx;
      intercept = my - slope * mx;
    } else {
      const t = r.obj(p.trendLine, 'trendLine');
      slope = r.num(t.slope, 'trendLine.slope');
      intercept = r.num(t.intercept, 'trendLine.intercept');
    }
    clipped.push(`<line x1="${n2(f.X(xRange[0]))}" y1="${n2(f.Y(slope * xRange[0] + intercept))}" x2="${n2(f.X(xRange[1]))}" y2="${n2(f.Y(slope * xRange[1] + intercept))}" stroke="${INK}" stroke-width="1.6"/>`);
    if (r.bool(p.showEquation, 'showEquation', false)) {
      const sig = (v: number) => Number(v.toPrecision(3));
      const b = sig(intercept);
      legend.push({ label: `y = ${String(sig(slope)).replace('-', '−')}x ${b < 0 ? '−' : '+'} ${Math.abs(b)}`, color: INK });
    }
  }
  pts.forEach((q, i) => {
    if (q.x < xRange[0] || q.x > xRange[1] || q.y < yRange[0] || q.y > yRange[1]) r.fail(`a point (${q.x}, ${q.y}) lies outside the ranges`);
    marks.push(shapeMark(shapeOf(q.series), f.X(q.x), f.Y(q.y), 3.6, colorOf(q.series)));
    facts.marks.push({ what: `points[${i}]`, cx: f.X(q.x), cy: f.Y(q.y) });
    if (q.label) labels.push(pointLabel(q.label, f.X(q.x), f.Y(q.y), f));
  });
  const lg = buildLegend(legend, f.bottom);
  return { body: `${clipDef(uid, f)}${f.svg}<g clip-path="url(#${uid}-clip)">${clipped.join('')}</g>${marks.join('')}${labels.join('')}${lg.svg}`, H: f.bottom + lg.height, facts };
}

// ---------------------------------------------------------------------------
// reaction_coordinate
// ---------------------------------------------------------------------------

const RC_FLAT = 0.18; // each plateau's share of the width
const RC_PEAK = 0.5;

function arrowHead(x: number, y: number, dir: 1 | -1, color: string): string {
  // dir 1 = pointing down (toward larger y on screen), -1 = up.
  return `<path d="M${n2(x)},${n2(y)}l-3.5,${n2(-6 * dir)}h7z" fill="${color}"/>`;
}

function renderReactionCoordinate(r: Reader): Drawn {
  const p = r.p;
  const R = r.optNum(p.reactantsEnergy ?? p.reactants_energy, 'reactantsEnergy') ?? 0;
  const P = r.num(p.productsEnergy ?? p.products_energy, 'productsEnergy');
  const eas = r.list(p.activationEnergies ?? p.activation_energies, 'activationEnergies', 1, 4)
    .map((v, i) => r.positive(v, `activationEnergies[${i}]`));
  eas.forEach((ea, i) => {
    if (!(R + ea > P)) r.fail(`activationEnergies[${i}]: the peak (${R + ea}) must be above the products (${P})`);
  });
  const labelsIn = (p.curveLabels ?? p.curve_labels) as unknown;
  const curveLabels = labelsIn === undefined ? [] : r.list(labelsIn, 'curveLabels', eas.length, eas.length).map((l, i) => r.str(l, `curveLabels[${i}]`, 40));
  const units = r.optStr(p.units, 'units', 16) ?? 'kJ/mol';
  const showAxisValues = r.bool(p.showAxisValues, 'showAxisValues', true);
  const annotate = p.annotate === undefined ? [] : r.list(p.annotate, 'annotate', 0, 2);
  for (const a of annotate) if (a !== 'Ea' && a !== 'deltaH') r.fail(`annotate entries must be 'Ea' or 'deltaH'`);
  const annotateValues = r.bool(p.annotateValues, 'annotateValues', false);
  const reactantLabel = r.optStr(p.reactantLabel ?? p.reactant_label, 'reactantLabel', 32) ?? 'Reactants';
  const productLabel = r.optStr(p.productLabel ?? p.product_label, 'productLabel', 32) ?? 'Products';

  const lo = Math.min(R, P);
  const hi = R + Math.max(...eas);
  const span = hi - lo;
  const wantEa = annotate.includes('Ea');
  const wantDh = annotate.includes('deltaH') && P !== R;
  // Room under the lowest level for its label, a little above the highest peak.
  const b = niceBounds(lo - 0.22 * span, hi + 0.08 * span, 10);
  const f = buildFrame({
    xRange: [0, 1],
    yRange: [b.min, b.max],
    yStep: b.step,
    xNumbers: false,
    yNumbers: showAxisValues,
    zeroAxes: false,
    yLabel: showAxisValues ? `Energy (${units})` : 'Energy',
    xLabel: 'Reaction progress →',
    title: r.optStr(p.title, 'title', 160),
    aspect: 0.74,
  });
  const ease = (t: number) => (1 - Math.cos(Math.PI * t)) / 2;
  const level = (u: number, ea: number): number => {
    const peak = R + ea;
    if (u <= RC_FLAT) return R;
    if (u <= RC_PEAK) return R + (peak - R) * ease((u - RC_FLAT) / (RC_PEAK - RC_FLAT));
    if (u < 1 - RC_FLAT) return peak + (P - peak) * ease((u - RC_PEAK) / (1 - RC_FLAT - RC_PEAK));
    return P;
  };
  const parts: string[] = [f.svg];
  const legend: LegendEntry[] = [];
  // Arrows carry the SYMBOL only; a value the spec asked for is written in
  // the caption row under the plot, where it cannot land on a curve.
  const captions: string[] = [];
  const valueText = (v: number) => `${tickText(Math.abs(v), 10 ** -decimalsOf(v))} ${units}`;
  if (wantEa || wantDh) {
    // The reactant level carried across, as the foot of the arrows.
    parts.push(`<line x1="${n2(f.X(RC_FLAT))}" y1="${n2(f.Y(R))}" x2="${n2(f.X(0.985))}" y2="${n2(f.Y(R))}" stroke="${MUTED}" stroke-width="1" stroke-dasharray="4 4"/>`);
  }
  // Several pathways: a stroke pattern each as well as a colour.
  const dashes = assignDashes(eas.map(() => false));
  eas.forEach((ea, i) => {
    const color = SERIES_COLORS[i % SERIES_COLORS.length];
    const pts: Array<[number, number]> = [];
    for (let k = 0; k <= 160; k++) pts.push([k / 160, level(k / 160, ea)]);
    parts.push(`<path d="${polyline(pts, f)}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"${dashAttr(dashes[i])}/>`);
    if (curveLabels[i]) legend.push({ label: curveLabels[i], color, dash: dashes[i] });
    if (wantEa) {
      // Under its own peak, inside the hump; several curves fan out about the centre.
      const u = RC_PEAK + (i - (eas.length - 1) / 2) * 0.08;
      const x = f.X(u);
      const yTop = f.Y(level(u, ea));
      const yBot = f.Y(R);
      parts.push(`<line x1="${n2(x)}" y1="${n2(yTop + 5)}" x2="${n2(x)}" y2="${n2(yBot - 5)}" stroke="${color}" stroke-width="1.3"/>${arrowHead(x, yTop + 1, -1, color)}${arrowHead(x, yBot - 1, 1, color)}`);
      const tag = eas.length > 1 ? ` (${i + 1})` : '';
      // "Ea" with the a set low by a dy shift — a subscript glyph is not in every system font.
      const left = i < eas.length / 2;
      parts.push(`<text x="${n2(x + (left ? -5 : 5))}" y="${n2(yBot - 12)}" font-size="${TICK_FS}" font-weight="600" text-anchor="${left ? 'end' : 'start'}" fill="${color}" ${HALO}>E<tspan dy="3" font-size="${TICK_FS - 3}">a</tspan><tspan dy="-3">${esc(tag)}</tspan></text>`);
      if (annotateValues) captions.push(`Ea${tag} = ${valueText(ea)}`);
    }
  });
  // ΔH: at the far right, between the carried-across reactant level and the
  // product plateau — the profile never enters that strip.
  const xDh = f.X(0.955);
  if (wantDh) {
    const yR = f.Y(R);
    const yP = f.Y(P);
    const dir: 1 | -1 = yP > yR ? 1 : -1;
    parts.push(`<line x1="${n2(xDh)}" y1="${n2(yR)}" x2="${n2(xDh)}" y2="${n2(yP - 5 * dir)}" stroke="${INK}" stroke-width="1.3"/>${arrowHead(xDh, yP - dir, dir, INK)}`);
    parts.push(`<text x="${n2(xDh - 6)}" y="${n2((yR + yP) / 2 + 4)}" font-size="${TICK_FS}" font-weight="600" text-anchor="end" fill="${INK}" ${HALO}>ΔH</text>`);
    const dh = P - R;
    if (annotateValues) captions.push(`ΔH = ${dh > 0 ? '+' : '−'}${valueText(dh)}`);
  }
  // Level names sit UNDER each plateau, where no curve runs: the profile only
  // rises from the reactants and only falls to the products. With an
  // endothermic ΔH arrow the strip under the products is taken, so the name
  // goes above the plateau when it fits there and left of the arrow when not.
  parts.push(`<text x="${n2(f.plot.x + 5)}" y="${n2(f.Y(R) + TICK_FS + 4)}" font-size="${TICK_FS}" font-weight="600" fill="${INK}" ${HALO}>${esc(reactantLabel)}</text>`);
  const plateauW = f.plot.w * RC_FLAT;
  let prodX = f.plot.x + f.plot.w - 5;
  let prodY = f.Y(P) + TICK_FS + 4;
  if (wantDh && P > R) {
    if (estWidth(productLabel, TICK_FS) <= plateauW - 6) prodY = f.Y(P) - 6;
    else prodX = xDh - 8;
  }
  parts.push(`<text x="${n2(prodX)}" y="${n2(prodY)}" font-size="${TICK_FS}" font-weight="600" text-anchor="end" fill="${INK}" ${HALO}>${esc(productLabel)}</text>`);
  let H = f.bottom;
  if (captions.length > 0) {
    const lines = wrapText(captions.join('  \u00b7  '), f.W - 20, TICK_FS);
    lines.forEach((line, i) => {
      parts.push(`<text x="${n2(f.W / 2)}" y="${n2(H + TICK_FS + i * (TICK_FS + 3))}" font-size="${TICK_FS}" font-weight="600" text-anchor="middle" fill="${INK}">${esc(line)}</text>`);
    });
    H += lines.length * (TICK_FS + 3) + 6;
  }
  const lg = buildLegend(legend, H);
  parts.push(lg.svg);
  return { body: parts.join(''), H: H + lg.height, facts: { plot: f.plot, curveCount: eas.length, marks: [], curves: [] } };
}

// ---------------------------------------------------------------------------
// titration_curve
// ---------------------------------------------------------------------------

const KW = 1e-14;

/** pH from the charge balance, by bisection — one formula for every region
 *  of the curve, so there is no seam at the buffer / equivalence boundaries. */
export function titrationPH(
  type: 'strong_acid' | 'weak_acid' | 'strong_base' | 'weak_base',
  k: number, // Ka of the weak acid, or Ka of the weak base's conjugate acid
  cAnalyte: number,
  vAnalyte: number,
  cTitrant: number,
  v: number,
): number {
  const total = vAnalyte + v;
  const cA = (cAnalyte * vAnalyte) / total;
  const cT = (cTitrant * v) / total;
  // Net positive charge at [H+] = h; increasing in h.
  const net = (h: number): number => {
    switch (type) {
      case 'strong_acid': return h + cT - KW / h - cA;
      case 'weak_acid': return h + cT - KW / h - (cA * k) / (k + h);
      case 'strong_base': return h + cA - KW / h - cT;
      case 'weak_base': return h + (cA * h) / (h + k) - KW / h - cT;
    }
  };
  let lo = -1; // pH
  let hi = 15;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (net(10 ** -mid) > 0) lo = mid;
    else hi = mid;
  }
  return Math.max(0, Math.min(14, (lo + hi) / 2));
}

function renderTitrationCurve(r: Reader, uid: string): Drawn {
  const p = r.p;
  const a = r.obj(p.analyte, 'analyte');
  const type = a.type as 'strong_acid' | 'weak_acid' | 'strong_base' | 'weak_base';
  if (!['strong_acid', 'weak_acid', 'strong_base', 'weak_base'].includes(type)) r.fail(`analyte.type must be strong_acid, weak_acid, strong_base or weak_base`);
  const cA = r.positive(a.concentration, 'analyte.concentration');
  const vA = r.positive(a.volume, 'analyte.volume');
  const cT = r.positive(p.titrantConcentration, 'titrantConcentration');
  if (cA > 5 || cT > 5) r.fail('concentrations above 5 mol/L are outside what this curve models');
  let k = 0;
  if (type === 'weak_acid') {
    const pKa = r.num(a.pKa, 'analyte.pKa');
    if (pKa < 0 || pKa > 14) r.fail('analyte.pKa must be between 0 and 14');
    k = 10 ** -pKa;
  } else if (type === 'weak_base') {
    const pKb = r.num(a.pKb, 'analyte.pKb');
    if (pKb < 0 || pKb > 14) r.fail('analyte.pKb must be between 0 and 14');
    k = KW / 10 ** -pKb;
  }
  const vEq = (cA * vA) / cT;
  const vMax = r.optNum(p.maxVolume, 'maxVolume') ?? niceBounds(0, 2 * vEq, 8).max;
  if (!(vMax > 0)) r.fail('maxVolume must be greater than 0');
  const marks = p.mark === undefined ? [] : r.list(p.mark, 'mark', 0, 2);
  for (const m of marks) if (m !== 'equivalence' && m !== 'half_equivalence') r.fail(`mark entries must be 'equivalence' or 'half_equivalence'`);
  const ph = (v: number) => titrationPH(type, k, cA, vA, cT, v);
  const f = buildFrame({
    xRange: [0, vMax],
    yRange: [0, 14],
    yStep: 2,
    xLabel: r.optStr(p.xLabel, 'xLabel') ?? 'Volume of titrant added (mL)',
    yLabel: 'pH',
    title: r.optStr(p.title, 'title', 160),
    aspect: 0.86,
    zeroAxes: false,
  });
  // Even samples, plus a geometric cluster about the equivalence volume so
  // the near-vertical rise is drawn, not chorded.
  const vs = new Set<number>();
  for (let i = 0; i <= 360; i++) vs.add((vMax * i) / 360);
  if (vEq < vMax) {
    for (let j = 0; j < 40; j++) {
      const d = vEq * 0.25 * 0.72 ** j;
      if (vEq - d > 0) vs.add(vEq - d);
      if (vEq + d < vMax) vs.add(vEq + d);
    }
    vs.add(vEq);
  }
  const pts = [...vs].sort((x, y) => x - y).map((v): [number, number] => [v, ph(v)]);
  const parts: string[] = [clipDef(uid, f), f.svg];
  parts.push(`<g clip-path="url(#${uid}-clip)"><path d="${polyline(pts, f)}" fill="none" stroke="${SERIES_COLORS[0]}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/></g>`);
  const legend: LegendEntry[] = [];
  const mark = (v: number, color: string, label: string) => {
    if (!(v > 0 && v < vMax)) r.fail(`the ${label} (${n2(v)} mL) is outside 0..maxVolume`);
    const x = f.X(v);
    const y = f.Y(ph(v));
    parts.push(`<path d="M${n2(x)},${n2(f.plot.y + f.plot.h)}V${n2(y)}H${n2(f.plot.x)}" fill="none" stroke="${color}" stroke-width="1.1" stroke-dasharray="4 3"/>`);
    parts.push(`<circle cx="${n2(x)}" cy="${n2(y)}" r="4" fill="${color}" stroke="#ffffff" stroke-width="1.2"/>`);
    legend.push({ label, color, mark: 'dot' });
  };
  if (marks.includes('half_equivalence')) mark(vEq / 2, SERIES_COLORS[2], 'half-equivalence point');
  if (marks.includes('equivalence')) mark(vEq, SERIES_COLORS[1], 'equivalence point');
  // Lettered points ON the curve ("which point is the buffer region?"): a dot at the curve's pH
  // for that volume and a letter beside it, set off the curve — no number, no guide line.
  const lettered = p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 6);
  const facts: FigureFacts = { plot: f.plot, curveCount: 1, marks: [], curves: [], notes: [] };
  const placed: Array<{ x0: number; y0: number; x1: number; y1: number }> = [];
  lettered.forEach((raw, i) => {
    const o = r.obj(raw, `points[${i}]`);
    const v = r.num(o.volume, `points[${i}].volume`);
    if (v < 0 || v > vMax) r.fail(`points[${i}].volume is outside 0..maxVolume`);
    const text = r.optStr(o.label, `points[${i}].label`, 6);
    const x = f.X(v);
    const y = f.Y(ph(v));
    facts.marks.push({ what: `points[${i}]`, cx: x, cy: y });
    parts.push(`<circle cx="${n2(x)}" cy="${n2(y)}" r="5.9" fill="#ffffff"/><circle cx="${n2(x)}" cy="${n2(y)}" r="3.8" fill="${INK}" stroke="${INK}" stroke-width="1.8"/>`);
    if (!text) return;
    // The curve rises to the right: up-left and down-right of a point are clear of it. Take the
    // first of those (then the others) that stays inside the plot and off the labels before it.
    const w = estWidth(text, LABEL_FS);
    const options: Array<[number, number, 'start' | 'end']> = [[x - 8, y - 8, 'end'], [x + 8, y + LABEL_FS + 5, 'start'], [x + 8, y - 8, 'start'], [x - 8, y + LABEL_FS + 5, 'end']];
    const boxOf = ([tx, ty, anchor]: [number, number, 'start' | 'end']) => ({ x0: anchor === 'end' ? tx - w : tx, y0: ty - LABEL_FS * 0.8, x1: anchor === 'end' ? tx : tx + w, y1: ty + LABEL_FS * 0.24 });
    const fits = (b: { x0: number; y0: number; x1: number; y1: number }) => b.x0 >= f.plot.x + 2 && b.x1 <= f.plot.x + f.plot.w - 2 && b.y0 >= f.plot.y + 2 && b.y1 <= f.plot.y + f.plot.h - 2
      && !placed.some((q) => b.x0 < q.x1 + 2 && q.x0 < b.x1 + 2 && b.y0 < q.y1 + 2 && q.y0 < b.y1 + 2);
    const at = options.find((c) => fits(boxOf(c)));
    if (!at) facts.notes?.push({ code: 'labels_overlap', message: `there is no clear place for the label "${text}" beside points[${i}]` });
    const [tx, ty, anchor] = at ?? options[0];
    placed.push(boxOf([tx, ty, anchor]), { x0: x - 6, y0: y - 6, x1: x + 6, y1: y + 6 });
    parts.push(`<text x="${n2(tx)}" y="${n2(ty)}" font-size="${LABEL_FS}" font-weight="700" text-anchor="${anchor}" fill="${INK}" ${HALO}>${esc(text)}</text>`);
  });
  if (lettered.length > 0) {
    const lg2 = buildLegend(legend, f.bottom);
    parts.push(lg2.svg);
    return { body: parts.join(''), H: f.bottom + lg2.height, facts };
  }
  const lg = buildLegend(legend, f.bottom);
  parts.push(lg.svg);
  return { body: parts.join(''), H: f.bottom + lg.height };
}

// ---------------------------------------------------------------------------
// slope_field
// ---------------------------------------------------------------------------

const SLOPE_STROKE = 1.6;

function renderSlopeField(r: Reader, uid: string): Drawn {
  const p = r.p;
  const xRange = r.range(p.xRange, 'xRange');
  const yRange = r.range(p.yRange, 'yRange');
  const expr = r.optStr(p.expr, 'expr', 200);
  let gx: number | undefined;
  let gy: number | undefined;
  if (Array.isArray(p.gridStep)) {
    gx = r.positive(p.gridStep[0], 'gridStep[0]');
    gy = r.positive(p.gridStep[1], 'gridStep[1]');
  } else if (p.gridStep !== undefined) {
    gx = gy = r.positive(p.gridStep, 'gridStep');
  }
  let samples: SlopeSample[];
  if (expr) {
    try {
      samples = slopeFieldSamples({ expr, xRange, yRange, xStep: gx, yStep: gy });
    } catch (err) {
      return r.fail(`expr: ${(err as Error).message}`);
    }
  } else {
    samples = r.list(p.samples, 'samples (or expr)', 1, 900).map((raw, i) => {
      if (Array.isArray(raw)) return { x: r.num(raw[0], `samples[${i}][0]`), y: r.num(raw[1], `samples[${i}][1]`), slope: typeof raw[2] === 'number' ? raw[2] : NaN };
      const o = r.obj(raw, `samples[${i}]`);
      return { x: r.num(o.x, `samples[${i}].x`), y: r.num(o.y, `samples[${i}].y`), slope: typeof o.slope === 'number' ? o.slope : NaN };
    });
  }
  // The lattice stays where the spec put it (questions name its points); the
  // PLOT grows by half a cell on every side instead, so the outermost
  // segments lie wholly inside the border rather than being cut by it.
  const uniq = (vals: number[]) => [...new Set(vals.map((v) => Number(v.toPrecision(10))))].sort((a, b) => a - b);
  const xs = uniq(samples.map((s) => s.x));
  const ys = uniq(samples.map((s) => s.y));
  const gap = (vals: number[], span: number) => (vals.length > 1 ? Math.min(...vals.slice(1).map((v, i) => v - vals[i])) : span / 12);
  const stepX = gap(xs, xRange[1] - xRange[0]);
  const stepY = gap(ys, yRange[1] - yRange[0]);
  const fx: [number, number] = [Math.min(xRange[0], xs[0] - stepX / 2), Math.max(xRange[1], xs[xs.length - 1] + stepX / 2)];
  const fy: [number, number] = [Math.min(yRange[0], ys[0] - stepY / 2), Math.max(yRange[1], ys[ys.length - 1] + stepY / 2)];
  const spanX = fx[1] - fx[0];
  const spanY = fy[1] - fy[0];
  const f = buildFrame({
    xRange: fx,
    yRange: fy,
    xStep: r.optStep(p.xStep, 'xStep'),
    yStep: r.optStep(p.yStep, 'yStep'),
    xLabel: r.optStr(p.xLabel, 'xLabel') ?? 'x',
    yLabel: r.optStr(p.yLabel, 'yLabel') ?? 'y',
    title: r.optStr(p.title, 'title', 160),
    aspect: Math.max(0.6, Math.min(1.25, spanY / spanX)),
    // The axes step back: a segment lying along one must not vanish into it.
    axisWidth: 1.1,
  });
  // Segment length from the lattice spacing actually present: two thirds of
  // a cell less the round caps, so collinear neighbours keep clear paper
  // between them at 340 px.
  const pxPerX = f.plot.w / spanX;
  const pxPerY = f.plot.h / spanY;
  const cell = Math.min(stepX * pxPerX, stepY * pxPerY);
  const len = Math.max(2, Math.min(cell * 0.66, cell - SLOPE_STROKE - 2.5));
  const segs: string[] = [];
  for (const s of samples) {
    if (Number.isNaN(s.slope)) continue;
    let ux = 0;
    let uy = -1; // vertical
    if (Number.isFinite(s.slope)) {
      const vx = pxPerX;
      const vy = -s.slope * pxPerY;
      const m = Math.hypot(vx, vy) || 1;
      ux = vx / m;
      uy = vy / m;
    }
    const cx = f.X(s.x);
    const cy = f.Y(s.y);
    segs.push(`M${n2(cx - (ux * len) / 2)},${n2(cy - (uy * len) / 2)}L${n2(cx + (ux * len) / 2)},${n2(cy + (uy * len) / 2)}`);
  }
  const parts: string[] = [clipDef(uid, f), f.svg];
  // Above the grid and the axes, each on a white under-stroke.
  const inner: string[] = [`<path d="${segs.join('')}" fill="none" stroke="#ffffff" stroke-width="${SLOPE_STROKE + 2}" stroke-linecap="round"/>`, `<path d="${segs.join('')}" fill="none" stroke="${SERIES_COLORS[0]}" stroke-width="${SLOPE_STROKE}" stroke-linecap="round"/>`];
  const legend: LegendEntry[] = [];
  let dot = '';
  if (p.solutionThrough !== undefined && p.solutionThrough !== null) {
    if (!expr) r.fail('solutionThrough needs expr');
    const through = readXY(r, p.solutionThrough, 'solutionThrough', 'x', 'y');
    const curve = slopeFieldSolution(expr as string, through, fx, fy);
    if (curve.length > 1) inner.push(`<path d="${polyline(curve, f)}" fill="none" stroke="${SERIES_COLORS[1]}" stroke-width="2.4" stroke-linejoin="round"/>`);
    dot = `<circle cx="${n2(f.X(through[0]))}" cy="${n2(f.Y(through[1]))}" r="4" fill="${SERIES_COLORS[1]}" stroke="#ffffff" stroke-width="1.2"/>`;
  }
  if (r.bool(p.showExpression, 'showExpression', false)) {
    if (!expr) r.fail('showExpression needs expr');
    legend.push({ label: `dy/dx = ${expr}`, color: SERIES_COLORS[0] });
  }
  parts.push(`<g clip-path="url(#${uid}-clip)">${inner.join('')}</g>${dot}`);
  const lg = buildLegend(legend, f.bottom);
  parts.push(lg.svg);
  return { body: parts.join(''), H: f.bottom + lg.height };
}

// ---------------------------------------------------------------------------
// free_body_diagram — the board's renderer, made standalone
// ---------------------------------------------------------------------------

/**
 * Turn a board renderer's static markup into a standalone figure body:
 * the first `<svg>`'s children, minus what only means something inside the
 * app (`class`, `data-*`, the root's sizing `style`), with every id — and
 * every reference to one — prefixed by `uid`. The renderer's HTML wrapper
 * (padding div, KaTeX title, notes) is left behind: a title is redrawn
 * inside the SVG by the caller only when the spec gave one.
 */
export function standaloneFromMarkup(markup: string, uid: string): { body: string; W: number; H: number } {
  const open = /<svg\b([^>]*)>/.exec(markup);
  const end = markup.lastIndexOf('</svg>');
  if (!open || end < 0) throw new Error('renderer produced no <svg>');
  const vb = /viewBox="\s*0\s+0\s+([\d.]+)\s+([\d.]+)\s*"/.exec(open[1]);
  if (!vb) throw new Error('renderer <svg> has no "0 0 W H" viewBox');
  let body = markup.slice(open.index + open[0].length, end);
  body = body.replace(/\s(?:class|data-[\w-]+)="[^"]*"/g, '');
  const ids = new Set<string>();
  body.replace(/\sid="([^"]+)"/g, (_, id: string) => {
    ids.add(id);
    return '';
  });
  for (const id of ids) {
    const safe = id.replace(/[^\w.-]/g, '_');
    const q = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    body = body
      .replace(new RegExp(`\\sid="${q}"`, 'g'), ` id="${uid}-${safe}"`)
      .replace(new RegExp(`url\\(#${q}\\)`, 'g'), `url(#${uid}-${safe})`)
      .replace(new RegExp(`href="#${q}"`, 'g'), `href="#${uid}-${safe}"`);
  }
  return { body, W: Number(vb[1]), H: Number(vb[2]) };
}

const FBD_DIRECTIONS = new Set(['up', 'down', 'left', 'right', 'up-left', 'up-right', 'down-left', 'down-right', 'normal', 'up-slope', 'down-slope', 'into-surface']);

function renderFreeBodyDiagram(r: Reader, uid: string): Drawn {
  const p = r.p;
  const object = p.object === undefined ? {} : r.obj(p.object, 'object');
  const shape = object.shape ?? 'box';
  if (shape !== 'box' && shape !== 'circle' && shape !== 'person') r.fail(`object.shape must be box, circle or person`);
  let surface: FreeBodyDiagramProps['surface'];
  if (p.surface !== undefined && p.surface !== null) {
    const s = r.obj(p.surface, 'surface');
    if (!['horizontal', 'inclined', 'vertical', 'none'].includes(s.type as string)) r.fail('surface.type must be horizontal, inclined, vertical or none');
    surface = {
      type: s.type as NonNullable<FreeBodyDiagramProps['surface']>['type'],
      ...(s.angle !== undefined ? { angle: r.num(s.angle, 'surface.angle') } : {}),
      ...(s.friction !== undefined ? { friction: r.bool(s.friction, 'surface.friction', false) } : {}),
    };
  }
  const forces = r.list(p.forces, 'forces', 1, 8).map((raw, i) => {
    const fo = r.obj(raw, `forces[${i}]`);
    const direction = fo.direction;
    if (typeof direction === 'number') r.num(direction, `forces[${i}].direction`);
    else if (typeof direction !== 'string' || !FBD_DIRECTIONS.has(direction)) r.fail(`forces[${i}].direction must be an angle in degrees or one of ${[...FBD_DIRECTIONS].join(', ')}`);
    const color = r.color(fo.color, '');
    return {
      name: r.str(fo.name, `forces[${i}].name`, 24),
      ...(fo.magnitude !== undefined ? { magnitude: r.str(fo.magnitude, `forces[${i}].magnitude`, 24) } : {}),
      direction: direction as FreeBodyDiagramProps['forces'][number]['direction'],
      ...(color ? { color } : {}),
      ...(fo.scale !== undefined ? { scale: Math.max(0.3, Math.min(2, r.positive(fo.scale, `forces[${i}].scale`))) } : {}),
    };
  });
  const props: FreeBodyDiagramProps = {
    object: {
      shape: shape as FreeBodyDiagramProps['object']['shape'],
      ...(object.label !== undefined ? { label: r.str(object.label, 'object.label', 24) } : {}),
      ...(object.mass !== undefined ? { mass: r.str(object.mass, 'object.mass', 24) } : {}),
    },
    ...(surface ? { surface } : {}),
    forces,
  };
  const { body, W, H } = standaloneFromMarkup(renderToStaticMarkup(React.createElement(FreeBodyDiagramRenderer, props)), uid);
  const title = r.optStr(p.title, 'title', 160);
  if (!title) return { body, W, H };
  // The board canvas is wider than the plot frame's; scale the title type with it.
  const fs = Math.round((TITLE_FS * W) / FIGURE_WIDTH);
  const lines = wrapText(title, W - 24, fs);
  const pad = 12 + lines.length * (fs + 4);
  const text = lines.map((line, i) => `<text x="${n2(W / 2)}" y="${n2(12 + fs + i * (fs + 4))}" font-size="${fs}" font-weight="600" text-anchor="middle" fill="${INK}">${esc(line)}</text>`).join('');
  return { body: `${text}<g transform="translate(0 ${pad})">${body}</g>`, W, H: H + pad };
}

// ---------------------------------------------------------------------------
// Entry points
// ---------------------------------------------------------------------------

/**
 * Draw a figure spec. Returns one standalone `<svg>` string that has passed
 * `validateFigureSvg`. Throws `PracticeFigureSpecError` for an unknown kind,
 * a bad param, or an expression that cannot be read — never returns a
 * partial or approximate picture.
 */
export function renderPracticeFigure(spec: PracticeFigureSpec): { svg: string } {
  return { svg: inspectPracticeFigure(spec).svg };
}

/** `renderPracticeFigure` plus the layout facts the legibility report reads.
 *  The picture is the same string either way. */
export function inspectPracticeFigure(spec: PracticeFigureSpec): { svg: string; facts: FigureFacts } {
  const kind = typeof spec?.type === 'string' ? spec.type : String(spec?.type);
  if (!spec || typeof spec.params !== 'object' || spec.params === null || Array.isArray(spec.params)) {
    throw new PracticeFigureSpecError(kind, 'params must be an object');
  }
  const r = new Reader(kind, spec.params);
  const uid = specUid(spec);
  let drawn: Drawn;
  switch (kind as AnyPracticeFigureKind) {
    case 'function_graph': drawn = renderFunctionGraph(r, uid); break;
    case 'motion_graph': drawn = renderMotionGraph(r, uid); break;
    case 'bar_chart': drawn = renderBarChart(r); break;
    case 'line_plot': drawn = renderLinePlot(r); break;
    case 'scatter_plot': drawn = renderScatterPlot(r, uid); break;
    case 'reaction_coordinate': drawn = renderReactionCoordinate(r); break;
    case 'titration_curve': drawn = renderTitrationCurve(r, uid); break;
    case 'slope_field': drawn = renderSlopeField(r, uid); break;
    case 'free_body_diagram': drawn = renderFreeBodyDiagram(r, uid); break;
    case 'unit_circle': drawn = renderUnitCircle(r); break;
    case 'vector_diagram': drawn = renderVectorDiagram(r); break;
    case 'free_body_diagram_v2': drawn = renderFreeBody(r); break;
    case 'shaded_region': drawn = renderShadedRegion(r, uid); break;
    case 'number_line': drawn = renderNumberLine(r); break;
    case 'sign_chart': drawn = renderSignChart(r); break;
    case 'distribution_curve': drawn = renderDistributionCurve(r, uid); break;
    case 'histogram': drawn = renderHistogram(r); break;
    case 'box_plot': drawn = renderBoxPlot(r); break;
    case 'polar_complex': drawn = renderPolarComplex(r); break;
    case 'punnett_square': drawn = renderPunnett(r, uid); break;
    case 'pedigree': drawn = renderPedigree(r); break;
    default: {
      const batch2 = renderBatch2(kind, r, uid);
      if (!batch2) throw new PracticeFigureSpecError(kind, `unknown figure kind — one of ${[...ALL_PRACTICE_FIGURE_KINDS, ...BATCH2_FIGURE_KINDS].join(', ')}`);
      drawn = batch2;
    }
  }
  const svg = svgDocument(drawn.W ?? FIGURE_WIDTH, drawn.H, drawn.body);
  const safety = validateFigureSvg(svg);
  if (!safety.ok) throw new PracticeFigureSpecError(kind, `rendered SVG failed the safety check (${safety.issues.join(', ')})`);
  return { svg, facts: drawn.facts ?? { curveCount: 0, marks: [], curves: [] } };
}

/**
 * The stored `figure` for a bank row: draw the spec, check the alt text
 * against the contract bounds, and keep the spec beside the picture so it
 * can be redrawn. Throws on anything that would be withheld at serve time.
 */
export function buildPracticeFigure(spec: PracticeFigureSpec, alt: string): { svg: string; alt: string; spec: PracticeFigureSpec } {
  if (typeof alt !== 'string' || alt.trim().length === 0) throw new PracticeFigureSpecError(spec?.type ?? '?', 'alt text is required');
  if (alt.length > 600) throw new PracticeFigureSpecError(spec.type, 'alt text is longer than 600 characters');
  const { svg } = renderPracticeFigure(spec);
  return { svg, alt: alt.trim(), spec: { type: spec.type, params: spec.params } };
}

/** The font stack on every figure's root — exported for the gallery page. */
export { FIGURE_FONT };
