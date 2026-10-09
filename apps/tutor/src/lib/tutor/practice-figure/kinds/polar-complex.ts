/**
 * polar_complex — points (and one optional polar curve) on the complex plane
 * or on a polar grid.
 *
 * { plane: 'complex' | 'polar';
 *   // complex: Re / Im axes on the plot frame's numbered square grid
 *   range?: number;                      // both axes run −range … range (default: fits the points)
 *   step?: number;
 *   // polar: concentric circles and rays
 *   rMax?: number; rStep?: number;       // circles at every rStep out to rMax, numbered
 *   angleStep?: 15 | 30 | 45 | 90 (30);  // a ray at every step
 *   angleLabels?: 'degrees' | 'radians' | 'none' ('degrees');
 *   points?: Array<{ re: number; im: number } | { r: number; theta: degrees }
 *                  & { label?: string;
 *                      showModulus?: boolean (false);    // the segment from the origin
 *                      showArgument?: boolean (false);   // the arc from the positive real axis / polar axis
 *                      argumentLabel?: string;           // printed at the arc ("θ")
 *                      projections?: boolean (false) }>; // dashes to the axes (complex plane)
 *   curve?: { expr: string;              // polar only: r as a function of theta (radians) —
 *                                        //   "4*cos(2*theta)", "1 + 2*sin(theta)", "theta/2"
 *             thetaRange?: [fromDeg, toDeg] ([0, 360]); label?: string };
 *   title?: string }
 *
 * The modulus and the argument are DRAWN when asked, never printed; the
 * curve's equation is printed only as its `label`.
 */
import { compileExpression } from '../expr';
import { FIGURE_WIDTH, LABEL_FS, SERIES_COLORS, TICK_FS, buildFrame, buildLegend, n2, niceStep, tickText, ticksBetween } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, MUTED, Placer, arcPath, around, label, layoutText, piText, segmentBoxes, text, textBox, titleBlock } from './draw';

export interface PlanePoint {
  re: number;
  im: number;
  /** Polar form: r ≥ 0 and the angle in degrees, −180 < θ ≤ 180. */
  r: number;
  theta: number;
  /** The angle exactly as the spec gave it (polar input), else `theta`. */
  givenTheta: number;
  label?: string;
  showModulus: boolean;
  showArgument: boolean;
  argumentLabel?: string;
  projections: boolean;
}

export interface PolarComplexModel {
  plane: 'complex' | 'polar';
  range: number;
  step?: number;
  rMax: number;
  rStep: number;
  angleStep: number;
  angleLabels: 'degrees' | 'radians' | 'none';
  /** Polar grid: every `circleLabelEvery`-th circle is numbered, and a ray label sits at every `rayLabelStep` degrees. */
  circleLabelEvery: number;
  rayLabelStep: number;
  points: PlanePoint[];
  curve?: { expr: string; fn: (theta: number) => number; from: number; to: number; label?: string };
  title?: string;
}

/** Radius of the outermost circle of a polar grid, in viewBox units. */
const POLAR_R = 112;

const clean = (v: number): number => {
  const r = Number(v.toFixed(9));
  return Object.is(r, -0) ? 0 : r;
};

export function polarComplexModel(r: Reader): PolarComplexModel {
  const p = r.p;
  if (p.plane !== 'complex' && p.plane !== 'polar') r.fail("plane must be 'complex' or 'polar'");
  const plane = p.plane as PolarComplexModel['plane'];
  const points = (p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 10)).map((raw, i): PlanePoint => {
    const o = r.obj(raw, `points[${i}]`);
    const at = `points[${i}]`;
    let re: number;
    let im: number;
    let givenTheta: number | undefined;
    if (o.r !== undefined && o.r !== null) {
      const rad = r.num(o.r, `${at}.r`);
      givenTheta = r.num(o.theta, `${at}.theta`);
      re = clean(rad * Math.cos((givenTheta * Math.PI) / 180));
      im = clean(rad * Math.sin((givenTheta * Math.PI) / 180));
    } else {
      re = r.num(o.re, `${at}.re`);
      im = r.num(o.im, `${at}.im`);
    }
    // Polar input keeps its own r and angle exactly (r < 0 is the point on the opposite ray).
    const polarR = givenTheta === undefined ? undefined : Math.abs(r.num(o.r, `${at}.r`));
    const polarTheta = givenTheta === undefined ? undefined : 180 - ((((180 - (givenTheta + ((o.r as number) < 0 ? 180 : 0))) % 360) + 360) % 360);
    const theta = polarTheta ?? clean((Math.atan2(im, re) * 180) / Math.PI);
    const showArgument = r.bool(o.showArgument, `${at}.showArgument`, false);
    if (showArgument && Math.hypot(re, im) < 1e-9) r.fail(`${at}.showArgument: the origin has no argument`);
    return {
      re, im, r: polarR ?? clean(Math.hypot(re, im)), theta, givenTheta: givenTheta ?? theta,
      label: r.optStr(o.label, `${at}.label`, 12),
      showModulus: r.bool(o.showModulus, `${at}.showModulus`, false),
      showArgument,
      argumentLabel: r.optStr(o.argumentLabel, `${at}.argumentLabel`, 8),
      projections: r.bool(o.projections, `${at}.projections`, false),
    };
  });
  const far = Math.max(0, ...points.map((q) => (plane === 'polar' ? q.r : Math.max(Math.abs(q.re), Math.abs(q.im)))));
  let curve: PolarComplexModel['curve'];
  if (p.curve !== undefined && p.curve !== null) {
    if (plane !== 'polar') r.fail("curve needs plane: 'polar'");
    const c = r.obj(p.curve, 'curve');
    const expr = r.str(c.expr, 'curve.expr', 200);
    let fn: (t: number) => number;
    try {
      fn = compileExpression(expr.replace(/\\?theta\b|θ/g, 'x'), ['x']);
    } catch (err) {
      return r.fail(`curve.expr: ${(err as Error).message} (write r as a function of theta)`);
    }
    const tr = c.thetaRange === undefined || c.thetaRange === null ? [0, 360] : r.range(c.thetaRange, 'curve.thetaRange');
    if (tr[1] - tr[0] > 360 * 6) r.fail('curve.thetaRange spans more than six turns');
    curve = { expr, fn, from: tr[0], to: tr[1], label: r.optStr(c.label, 'curve.label', 40) };
  }
  const angleStep = p.angleStep === undefined || p.angleStep === null ? 30 : r.num(p.angleStep, 'angleStep');
  if (![15, 30, 45, 90].includes(angleStep)) r.fail('angleStep must be one of 15, 30, 45, 90');
  const angleLabels = (p.angleLabels ?? 'degrees') as PolarComplexModel['angleLabels'];
  if (!['degrees', 'radians', 'none'].includes(angleLabels)) r.fail("angleLabels must be 'degrees', 'radians' or 'none'");
  if (plane === 'complex' && points.length === 0) r.fail('needs at least one point');
  if (plane === 'polar' && points.length === 0 && !curve) r.fail('needs at least one point or a curve');
  let range = 0;
  let rMax = 0;
  let rStep = 1;
  if (plane === 'complex') {
    range = p.range === undefined || p.range === null ? Math.max(2, Math.ceil(far + 1)) : r.positive(p.range, 'range');
    points.forEach((q, i) => {
      if (Math.abs(q.re) > range || Math.abs(q.im) > range) r.fail(`points[${i}] lies outside −${range} … ${range}`);
    });
  } else {
    rMax = p.rMax === undefined || p.rMax === null ? Math.max(1, Math.ceil(far)) : r.positive(p.rMax, 'rMax');
    rStep = r.optStep(p.rStep, 'rStep') ?? niceStep(rMax, 5);
    if (rMax / rStep > 8) r.fail('rMax / rStep: more than 8 circles');
    points.forEach((q, i) => {
      if (q.r > rMax + 1e-9) r.fail(`points[${i}] lies outside the grid (r = ${q.r}, rMax = ${rMax})`);
    });
    if (curve) {
      for (let k = 0; k <= 720; k++) {
        const th = ((curve.from + ((curve.to - curve.from) * k) / 720) * Math.PI) / 180;
        const v = curve.fn(th);
        if (!Number.isFinite(v)) r.fail(`curve.expr has no value at theta = ${Number(((th * 180) / Math.PI).toFixed(1))}°`);
        if (Math.abs(v) > rMax * 1.0001) r.fail(`curve: |r| reaches ${Number(Math.abs(v).toFixed(3))}, outside the grid — raise rMax`);
      }
    }
  }
  const circleLabelEvery = plane === 'polar' ? Math.max(1, Math.ceil(16 / ((rStep / rMax) * POLAR_R))) : 1;
  return { plane, range, step: r.optStep(p.step, 'step'), rMax, rStep, angleStep, angleLabels, circleLabelEvery, rayLabelStep: angleStep === 15 ? 30 : angleStep, points, curve, title: r.optStr(p.title, 'title', 160) };
}

const BLUE = SERIES_COLORS[0];
const RED = SERIES_COLORS[1];

export function renderPolarComplex(r: Reader): Drawn {
  const m = polarComplexModel(r);
  const notes: NonNullable<FigureFacts['notes']> = [];
  const lines: string[] = [];
  const dots: string[] = [];
  const labels: string[] = [];
  let head: string;
  let H: number;
  let X: (v: number) => number;
  let Y: (v: number) => number;
  let placer: Placer;
  let plot: FigureFacts['plot'];
  let legendY = 0;

  if (m.plane === 'complex') {
    const step = m.step ?? (m.range <= 6 ? 1 : undefined);
    const f = buildFrame({ xRange: [-m.range, m.range], yRange: [-m.range, m.range], xStep: step, yStep: step, xLabel: 'Re', yLabel: 'Im', title: m.title, aspect: 1, commonStep: true });
    head = f.svg;
    H = f.bottom;
    X = f.X;
    Y = f.Y;
    plot = f.plot;
    placer = new Placer({ x0: f.plot.x + 2, y0: f.plot.y + 2, x1: f.plot.x + f.plot.w - 2, y1: f.plot.y + f.plot.h - 2 });
    placer.block(...segmentBoxes(f.X(-m.range), f.Y(0), f.X(m.range), f.Y(0), 1.5), ...segmentBoxes(f.X(0), f.Y(-m.range), f.X(0), f.Y(m.range), 1.5));
  } else {
    const W = FIGURE_WIDTH;
    const t = titleBlock(m.title, W);
    const R = POLAR_R;
    const pad = m.angleLabels === 'none' ? 12 : 24;
    const cx = W / 2;
    const cy = t.top + pad + R;
    X = (v: number) => cx + (v / m.rMax) * R;
    Y = (v: number) => cy - (v / m.rMax) * R;
    const grid: string[] = [];
    const rays: string[] = [];
    for (let a = 0; a < 360; a += m.angleStep) {
      const rad = (a * Math.PI) / 180;
      rays.push(`M${n2(cx)},${n2(cy)}L${n2(cx + R * Math.cos(rad))},${n2(cy - R * Math.sin(rad))}`);
    }
    grid.push(`<path d="${rays.join('')}" fill="none" stroke="#cbd5e1" stroke-width="0.9"/>`);
    const circles = ticksBetween(m.rStep, m.rMax, m.rStep);
    for (const c of circles) grid.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2((c / m.rMax) * R)}" fill="none" stroke="${Math.abs(c - m.rMax) < 1e-9 ? '#94a3b8' : '#cbd5e1'}" stroke-width="${Math.abs(c - m.rMax) < 1e-9 ? 1.1 : 0.9}"/>`);
    // The polar axis (θ = 0) is the heavy line; the circles are numbered along it.
    grid.push(`<line x1="${n2(cx)}" y1="${n2(cy)}" x2="${n2(cx + R)}" y2="${n2(cy)}" stroke="${INK}" stroke-width="1.4"/>`);
    const labelEvery = m.circleLabelEvery;
    circles.forEach((c, i) => {
      if ((i + 1) % labelEvery !== 0) return;
      grid.push(text(cx + (c / m.rMax) * R - 3, cy + TICK_FS + 2, tickText(c, m.rStep), { anchor: 'end', fill: MUTED, halo: true }));
    });
    // Ray labels outside the grid: every ray, or every other one when they are 15° apart.
    if (m.angleLabels !== 'none') {
      const every = m.rayLabelStep;
      for (let a = 0; a < 360; a += every) {
        const rad = (a * Math.PI) / 180;
        const s = m.angleLabels === 'degrees' ? `${a}°` : piText(a, 180);
        const ux = Math.cos(rad);
        const uy = -Math.sin(rad);
        const anchor = ux > 0.3 ? 'start' : ux < -0.3 ? 'end' : 'middle';
        grid.push(text(cx + (R + 6) * ux, cy + (R + 6) * uy + (uy > 0.3 ? TICK_FS * 0.8 : uy < -0.3 ? -1 : TICK_FS * 0.36), s, { anchor, fill: MUTED }));
      }
    }
    head = t.svg + grid.join('');
    H = cy + R + pad + 4;
    legendY = H;
    placer = new Placer({ x0: cx - R, y0: cy - R, x1: cx + R, y1: cy + R });
    circles.forEach((c, i) => {
      if ((i + 1) % labelEvery === 0) placer.block(textBox(cx + (c / m.rMax) * R - 3, cy + TICK_FS + 2, tickText(c, m.rStep), TICK_FS, 'end'));
    });
    if (m.curve) {
      const d: string[] = [];
      const n = Math.max(240, Math.round((m.curve.to - m.curve.from) * 1.5));
      for (let k = 0; k <= n; k++) {
        const th = ((m.curve.from + ((m.curve.to - m.curve.from) * k) / n) * Math.PI) / 180;
        const v = m.curve.fn(th);
        d.push(`${k === 0 ? 'M' : 'L'}${n2(X(v * Math.cos(th)))},${n2(Y(v * Math.sin(th)))}`);
      }
      lines.push(`<path d="${d.join('')}" fill="none" stroke="${BLUE}" stroke-width="2.2" stroke-linejoin="round"/>`);
    }
  }

  const ox = X(0);
  const oy = Y(0);
  m.points.forEach((q) => {
    if (q.showModulus || q.projections || q.showArgument) placer.block(...segmentBoxes(ox, oy, X(q.re), Y(q.im), 2.5));
  });
  m.points.forEach((q, i) => {
    const px = X(q.re);
    const py = Y(q.im);
    const color = m.curve ? RED : BLUE;
    if (q.projections && m.plane === 'complex') {
      lines.push(`<path d="M${n2(px)},${n2(oy)}V${n2(py)}H${n2(ox)}" fill="none" stroke="${MUTED}" stroke-width="1.2" stroke-dasharray="3 3"/>`);
      placer.block(...segmentBoxes(px, oy, px, py, 2), ...segmentBoxes(px, py, ox, py, 2));
    }
    if (q.showModulus || q.showArgument) lines.push(`<line x1="${n2(ox)}" y1="${n2(oy)}" x2="${n2(px)}" y2="${n2(py)}" stroke="${color}" stroke-width="1.9"/>`);
    if (q.showArgument) {
      const ar = 20 + (i % 3) * 7;
      const sweep = (q.theta * Math.PI) / 180;
      lines.push(`<path d="${arcPath(ox, oy, ar, 0, sweep)}" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
      if (q.argumentLabel) {
        const c = placer.place(q.argumentLabel, TICK_FS, [ar + 10, ar + 17, ar + 26].map((d) => ({ x: ox + d * Math.cos(sweep / 2), y: oy - d * Math.sin(sweep / 2) + TICK_FS * 0.36, anchor: 'middle' as const })));
        labels.push(text(c.x, c.y, q.argumentLabel, { anchor: c.anchor, weight: 600, halo: true }));
      }
    }
    dots.push(`<circle cx="${n2(px)}" cy="${n2(py)}" r="4.2" fill="${color}" stroke="#ffffff" stroke-width="1.2"/>`);
    placer.block({ x0: px - 5, y0: py - 5, x1: px + 5, y1: py + 5 });
  });
  m.points.forEach((q, i) => {
    if (!q.label) return;
    const px = X(q.re);
    const py = Y(q.im);
    const len = Math.hypot(px - ox, py - oy) || 1;
    const c = placer.place(layoutText(q.label), LABEL_FS, around(px, py, LABEL_FS, len > 1 ? (px - ox) / len : 0.7, len > 1 ? (py - oy) / len : -0.7, [8, 13, 19]));
    if (!c.clean) notes.push({ code: 'labels_overlap', message: `points[${i}]: there is no clear place for the label "${q.label}"` });
    labels.push(label(c, q.label, { fs: LABEL_FS, weight: 700, halo: true }));
  });
  let legend = '';
  if (m.curve?.label) {
    const lg = buildLegend([{ label: m.curve.label, color: BLUE }], legendY);
    legend = lg.svg;
    H = legendY + lg.height;
  }
  if (m.plane === 'polar' && m.angleStep === 15 && m.rMax / m.rStep > 5) notes.push({ code: 'crowded', message: 'rays every 15° with more than 5 circles — the grid is too fine to read a point from at 340 px' });
  return { body: head + lines.join('') + dots.join('') + labels.join('') + legend, H, facts: { plot, curveCount: m.curve ? 1 : 0, marks: [], curves: [], notes } };
}
