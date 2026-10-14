/**
 * coordinate_grid — a blank numbered grid: the base a student plots points
 * or a line on (a drawn answer, contract v1.22.0). It draws NO data, so it
 * can never give the answer away.
 *
 * { xRange: [min, max]; yRange: [min, max];
 *   xStep?: number; yStep?: number;      // numbered gridline spacing (default: one round step for both)
 *   xLabel?: string ('x'); yLabel?: string ('y'); title?: string }
 *
 * Laid out exactly like a function_graph (buildFrame, a common step, cells
 * as square as the ranges allow), and reports its `frame` (spec.ts
 * `FigureFrame`) so the drawing overlay maps a tap to data values.
 */
import { buildFrame } from '../plot-frame';
import type { Drawn, Reader } from '../spec';

export function renderCoordinateGrid(r: Reader): Drawn {
  const p = r.p;
  const xRange = r.range(p.xRange, 'xRange');
  const yRange = r.range(p.yRange, 'yRange');
  const f = buildFrame({
    xRange,
    yRange,
    xStep: r.optStep(p.xStep, 'xStep'),
    yStep: r.optStep(p.yStep, 'yStep'),
    xLabel: r.optStr(p.xLabel, 'xLabel') ?? 'x',
    yLabel: r.optStr(p.yLabel, 'yLabel') ?? 'y',
    title: r.optStr(p.title, 'title', 160),
    aspect: Math.max(0.6, Math.min(1.25, (yRange[1] - yRange[0]) / (xRange[1] - xRange[0]))),
    commonStep: true,
  });
  return {
    body: f.svg,
    H: f.bottom + 6,
    facts: { plot: f.plot, curveCount: 0, marks: [], curves: [] },
    frame: { kind: 'grid', plot: { ...f.plot }, xRange, yRange },
  };
}
