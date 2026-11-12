/**
 * solid_of_revolution — a 2D region revolved about an axis to form a 3D solid,
 * with a representative disk / washer / shell slice. The core AP Calc BC volumes
 * figure (disk/washer/shell method). A rough sketch can't draw a 3D surface of
 * revolution; this renders it deterministically from a pre-sampled radius
 * profile (the brain samples the bounding curve, like riemann_sum).
 */

import type { FeatureManifestEntry } from '@/lib/tutor/diagrams/layout';
import { latexToJs } from '@/lib/tutor/whiteboard/intersection-validator';

export type RevolutionMethod = 'disk' | 'washer' | 'shell';
export type RevolutionAxis = 'x' | 'y';

export interface SolidOfRevolutionFigure {
  /** Outer radius profile as points along the axis: [[u, r], …], r ≥ 0. For
   *  axis 'x', u is x and r is the distance from the x-axis; for 'y', u is y. */
  outer: Array<[number, number]>;
  /** Inner radius profile (the hole) — present ⇒ washer. */
  inner?: Array<[number, number]>;
  axis: RevolutionAxis;
  method: RevolutionMethod;
  /** Bounds along the axis (derived from the profiles). */
  a: number;
  b: number;
  /** Where the representative slice is drawn (axis coordinate). */
  representativeAt: number;
  funcLabel?: string;
  innerLabel?: string;
  axisLabel?: string;
  title?: string;
}

function toPairs(v: unknown): Array<[number, number]> | null {
  if (!Array.isArray(v) || v.length < 2) return null;
  const out: Array<[number, number]> = [];
  for (const p of v) {
    let x: number, y: number;
    if (Array.isArray(p) && p.length >= 2) {
      x = Number(p[0]); y = Number(p[1]);
    } else if (p && typeof p === 'object') {
      x = Number((p as Record<string, unknown>).x);
      y = Number((p as Record<string, unknown>).y);
    } else return null;
    if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
    out.push([x, Math.abs(y)]); // radius is a distance ⇒ non-negative
  }
  return out;
}

/** A curve given as a formula ("sqrt(x)", "x^2", "2") sampled into a radius profile. A handful of points typed
 *  by hand drew y = √x as a cone with straight sides (AP Calc BC, 2026-11-11); the formula draws the curve. */
const PROFILE_SAMPLES = 40;
function sampleProfile(expr: unknown, from: number, to: number, variable: 'x' | 'y', what: string): Array<[number, number]> | null {
  if (typeof expr !== 'string' && typeof expr !== 'number') return null;
  const written = String(expr).replace(/−/g, '-').replace(/√\s*\(/g, '\\sqrt(').replace(/√\s*([A-Za-z0-9.]+)/g, '\\sqrt{$1}')
    .replace(/(?<![\\A-Za-z])(sqrt|sin|cos|tan|ln|log|abs)\s*\(/g, '\\$1(').replace(/π/g, '\\pi');
  const js = latexToJs(written, variable);
  if (!js) throw new Error(`solid_of_revolution: ${what} "${String(expr).slice(0, 40)}" is not an expression in ${variable} that can be drawn`);
  let f: (v: number) => number;
  try { f = new Function(variable, `"use strict"; return (${js});`) as (v: number) => number; } catch { throw new Error(`solid_of_revolution: ${what} "${String(expr).slice(0, 40)}" could not be read`); }
  const pts: Array<[number, number]> = [];
  for (let i = 0; i <= PROFILE_SAMPLES; i++) {
    const u = from + ((to - from) * i) / PROFILE_SAMPLES; const r = f(u);
    if (!Number.isFinite(r)) throw new Error(`solid_of_revolution: ${what} has no value at ${variable} = ${Math.round(u * 1000) / 1000}`);
    pts.push([u, Math.abs(r)]);
  }
  return pts;
}

export function solveSolidOfRevolution(params: Record<string, unknown>): SolidOfRevolutionFigure {
  const variable: 'x' | 'y' = params.axis === 'y' ? 'y' : 'x';
  const from = Number(params.from); const to = Number(params.to);
  const byFormula = typeof params.outer === 'string' || typeof params.outer === 'number';
  if (byFormula && !(Number.isFinite(from) && Number.isFinite(to) && to > from)) throw new Error('solid_of_revolution: from and to are the bounds along the axis, with to greater than from');
  const outer = byFormula ? sampleProfile(params.outer, from, to, variable, 'outer') : toPairs(params.outer ?? params.curve);
  if (!outer) throw new Error('solid_of_revolution: outer is the outer curve as an expression in x (e.g. "sqrt(x)") with from and to, or ≥2 points of [u, r]');
  outer.sort((p, q) => p[0] - q[0]);
  const inner = typeof params.inner === 'string' || typeof params.inner === 'number' ? sampleProfile(params.inner, byFormula ? from : outer[0][0], byFormula ? to : outer[outer.length - 1][0], variable, 'inner') : toPairs(params.inner);
  if (inner) inner.sort((p, q) => p[0] - q[0]);

  const axis: RevolutionAxis = params.axis === 'y' ? 'y' : 'x';
  let method: RevolutionMethod;
  if (params.method === 'shell' || params.method === 'washer' || params.method === 'disk') {
    method = params.method;
  } else {
    method = inner ? 'washer' : 'disk';
  }
  const a = outer[0][0];
  const b = outer[outer.length - 1][0];
  let rep = typeof params.representativeAt === 'number' ? params.representativeAt : (a + b) / 2;
  rep = Math.max(a, Math.min(b, rep));

  return {
    outer,
    inner: inner ?? undefined,
    axis,
    method,
    a,
    b,
    representativeAt: rep,
    funcLabel: typeof params.funcLabel === 'string' ? params.funcLabel : undefined,
    innerLabel: typeof params.innerLabel === 'string' ? params.innerLabel : undefined,
    axisLabel: typeof params.axisLabel === 'string' ? params.axisLabel : undefined,
    title: typeof params.title === 'string' ? params.title : undefined,
  };
}

export const solidOfRevolutionFeatureNames = {
  solid: 'solid',
  axis: 'axis-of-revolution',
  slice: 'representative-slice',
  curve: 'generating-curve',
};

export function buildSolidOfRevolutionManifest(figure: SolidOfRevolutionFigure): FeatureManifestEntry[] {
  const N = solidOfRevolutionFeatureNames;
  const sliceWord = figure.method === 'shell' ? 'shell' : figure.method === 'washer' ? 'washer' : 'disk';
  return [
    {
      name: N.solid,
      kind: 'region',
      description: figure.title ? `solid of revolution: ${figure.title}` : 'solid of revolution',
      labels: ['solid', 'the solid', 'solid of revolution', 'the diagram'],
      displayName: figure.title || 'solid of revolution',
      scribbleable: true,
    },
    {
      name: N.axis,
      kind: 'axis',
      description: `axis of revolution (${figure.axis}-axis)`,
      labels: ['axis of revolution', 'the axis', `${figure.axis}-axis`, 'axis of rotation'],
      displayName: 'axis of revolution',
      scribbleable: true,
    },
    {
      name: N.curve,
      kind: 'curve',
      description: figure.funcLabel ? `generating curve ${figure.funcLabel}` : 'generating curve',
      labels: ['the curve', 'generating curve', 'the region', ...(figure.funcLabel ? [figure.funcLabel] : [])],
      displayName: figure.funcLabel || 'generating curve',
      scribbleable: true,
    },
    {
      name: N.slice,
      kind: 'area',
      description: `representative ${sliceWord}`,
      labels: [`the ${sliceWord}`, `representative ${sliceWord}`, 'the slice', 'representative slice', 'the cross-section'],
      displayName: `representative ${sliceWord}`,
      scribbleable: true,
    },
  ];
}
