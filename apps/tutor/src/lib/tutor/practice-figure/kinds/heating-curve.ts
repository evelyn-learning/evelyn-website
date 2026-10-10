/**
 * heating_curve — batch 4 (2026-10-14): temperature against heat added (a
 * heating curve), heat removed (a cooling curve) or time, as sloped
 * single-phase segments joined by flat phase-change plateaus.
 *
 *   { // EITHER computed from the substance:
 *     substance?: { mass: number (g); meltingPoint: number; boilingPoint: number;      // °C
 *                   cSolid: number; cLiquid: number; cGas: number;                      // J/(g·°C)
 *                   heatFusion: number; heatVaporization: number };                     // J/g
 *     startTemp?: number; endTemp?: number;   // end below start ⇒ a COOLING curve. A curve that starts
 *                                             //   or ends exactly at the melting / boiling point
 *                                             //   includes that whole plateau.
 *     // OR drawn through given corners:
 *     corners?: Array<[x, temperature]>;      // 2–10, x increasing from the first; a flat run is a plateau
 *     xQuantity?: 'heat' | 'time' ('heat');   // time needs `power` with a substance
 *     heatUnit?: 'J' | 'kJ' ('kJ'); power?: number (W); timeUnit?: 's' | 'min' ('min');
 *     xNumbers?: boolean (true); yNumbers?: boolean (true);   // false ⇒ an unnumbered, qualitative axis
 *     segmentLabels?: 'letters' | 'none' | string[] ('none'); // "A", "B", … beside each segment, or your own
 *     plateauLabels?: 'value' | 'blank' | 'none' ('none');    // the temperature printed at each plateau ("?" = a blank box)
 *     marks?: Array<{ x: number; label?: string }>;           // ≤ 5 dots ON the curve at those x
 *     xMax?: number; xStep?: number; yRange?: [min, max]; yStep?: number;
 *     strongGrid?: boolean;   // the grid one step darker. Default: only when a corner or a mark sits on a
 *                             //   LIGHTER gridline (between two numbers) — it is then read off that line
 *     tempUnit?: string ('°C'); xLabel?: string; yLabel?: string; title?: string }
 *
 * Nothing that states an answer is printed unless asked: no phase names, no
 * plateau temperatures, no heats.
 */
import { LABEL_FS, SERIES_COLORS, TICK_FS, buildFrame, gridPlace, minorStepOf, n2, niceBounds, type Frame } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, text } from './draw';
import { lab, numStr, type Notes, type Show, SHOWS } from './draw2';

export type SegmentKind = 'solid' | 'melting' | 'liquid' | 'boiling' | 'gas' | 'freezing' | 'condensing' | 'plateau' | 'sloped';
export interface HeatSegment { x0: number; t0: number; x1: number; t1: number; kind: SegmentKind; label?: string }
export interface HeatingModel {
  cooling: boolean;
  computed: boolean;
  xQuantity: 'heat' | 'time';
  heatUnit: 'J' | 'kJ';
  timeUnit: 's' | 'min';
  /** Heat (in `heatUnit`) per unit of x — 1 for a heat axis; for a time axis only when `power` was given. */
  heatPerX?: number;
  mass?: number;
  segments: HeatSegment[];
  xNumbers: boolean;
  yNumbers: boolean;
  plateauLabels: Show;
  marks: Array<{ x: number; t: number; label?: string }>;
  xRange: [number, number];
  yRange: [number, number];
  xStep: number;
  yStep: number;
  tempUnit: string;
  xLabel: string;
  yLabel: string;
  title?: string;
}

const LETTERS = 'ABCDEFGHIJ';

export function heatingModel(r: Reader): HeatingModel {
  const p = r.p;
  const pick = <T extends string>(v: unknown, name: string, allowed: readonly T[], dflt: T): T => {
    if (v === undefined || v === null) return dflt;
    if (typeof v !== 'string' || !allowed.includes(v as T)) r.fail(`${name} must be one of ${allowed.join(', ')}`);
    return v as T;
  };
  const xQuantity = pick(p.xQuantity, 'xQuantity', ['heat', 'time'] as const, 'heat');
  const heatUnit = pick(p.heatUnit, 'heatUnit', ['J', 'kJ'] as const, 'kJ');
  const timeUnit = pick(p.timeUnit, 'timeUnit', ['s', 'min'] as const, 'min');
  const computed = p.substance !== undefined && p.substance !== null;
  let corners: Array<[number, number]>;
  let kinds: SegmentKind[];
  let cooling: boolean;
  let heatPerX: number | undefined = xQuantity === 'heat' ? 1 : undefined;
  let mass: number | undefined;
  if (computed) {
    if (p.corners !== undefined && p.corners !== null) r.fail('give substance (with startTemp and endTemp) or corners, not both');
    const s = r.obj(p.substance, 'substance');
    mass = r.positive(s.mass, 'substance.mass');
    const mp = r.num(s.meltingPoint, 'substance.meltingPoint');
    const bp = r.num(s.boilingPoint, 'substance.boilingPoint');
    if (!(bp > mp)) r.fail('substance.boilingPoint must be above substance.meltingPoint');
    const c = [r.positive(s.cSolid, 'substance.cSolid'), r.positive(s.cLiquid, 'substance.cLiquid'), r.positive(s.cGas, 'substance.cGas')];
    const hf = r.positive(s.heatFusion, 'substance.heatFusion');
    const hv = r.positive(s.heatVaporization, 'substance.heatVaporization');
    const a = r.num(p.startTemp, 'startTemp');
    const b = r.num(p.endTemp, 'endTemp');
    if (a === b) r.fail('startTemp and endTemp must differ');
    cooling = b < a;
    const lo = Math.min(a, b);
    const hi = Math.max(a, b);
    // Built as a heating curve from lo to hi (in joules); a cooling curve is its mirror image.
    const up: Array<{ q: number; t0: number; t1: number; kind: SegmentKind }> = [];
    const stage = (from: number, to: number, cc: number, kind: SegmentKind) => {
      const t0 = Math.max(lo, from);
      const t1 = Math.min(hi, to);
      if (t1 > t0) up.push({ q: mass as number * cc * (t1 - t0), t0, t1, kind });
    };
    stage(-Infinity, mp, c[0], 'solid');
    if (lo <= mp && mp <= hi) up.push({ q: mass * hf, t0: mp, t1: mp, kind: 'melting' });
    stage(mp, bp, c[1], 'liquid');
    if (lo <= bp && bp <= hi) up.push({ q: mass * hv, t0: bp, t1: bp, kind: 'boiling' });
    stage(bp, Infinity, c[2], 'gas');
    const seq = cooling ? up.slice().reverse().map((u) => ({ ...u, t0: u.t1, t1: u.t0, kind: (u.kind === 'melting' ? 'freezing' : u.kind === 'boiling' ? 'condensing' : u.kind) as SegmentKind })) : up;
    let scale = heatUnit === 'kJ' ? 1 / 1000 : 1;
    if (xQuantity === 'time') {
      const power = r.positive(p.power, 'power');
      heatPerX = (power * (timeUnit === 'min' ? 60 : 1)) * scale;
      scale = 1 / (power * (timeUnit === 'min' ? 60 : 1));
    }
    corners = [[0, seq[0].t0]];
    kinds = [];
    let x = 0;
    for (const u of seq) {
      x += u.q * scale;
      corners.push([Number(x.toPrecision(10)), u.t1]);
      kinds.push(u.kind);
    }
  } else {
    corners = r.list(p.corners, 'corners', 2, 10).map((pt, i) => {
      if (!Array.isArray(pt) || pt.length !== 2) r.fail(`corners[${i}] must be [x, temperature]`);
      return [r.num((pt as unknown[])[0], `corners[${i}][0]`), r.num((pt as unknown[])[1], `corners[${i}][1]`)] as [number, number];
    });
    for (let i = 1; i < corners.length; i++) if (!(corners[i][0] > corners[i - 1][0])) r.fail(`corners[${i}]: x must increase from one corner to the next`);
    const dirs = corners.slice(1).map((c, i) => Math.sign(c[1] - corners[i][1]));
    if (dirs.some((d) => d > 0) && dirs.some((d) => d < 0)) r.fail('corners: the temperature must only rise (a heating curve) or only fall (a cooling curve)');
    if (dirs.every((d) => d === 0)) r.fail('corners: the temperature never changes');
    for (let i = 1; i < dirs.length; i++) if (dirs[i] === 0 && dirs[i - 1] === 0) r.fail(`corners[${i}]: two flat runs in a row — give a plateau as one segment`);
    cooling = dirs.some((d) => d < 0);
    kinds = dirs.map((d) => (d === 0 ? 'plateau' : 'sloped'));
    if (xQuantity === 'time' && p.power !== undefined && p.power !== null) heatPerX = r.positive(p.power, 'power') * (timeUnit === 'min' ? 60 : 1) * (heatUnit === 'kJ' ? 1 / 1000 : 1);
  }
  const n = kinds.length;
  let names: Array<string | undefined>;
  if (p.segmentLabels === undefined || p.segmentLabels === null || p.segmentLabels === 'none') names = kinds.map(() => undefined);
  else if (p.segmentLabels === 'letters') names = kinds.map((_, i) => LETTERS[i]);
  else if (Array.isArray(p.segmentLabels)) {
    if (p.segmentLabels.length !== n) r.fail(`segmentLabels must have one entry per segment (${n}), or be "letters" or "none"`);
    names = p.segmentLabels.map((s, i) => (s === null || s === '' ? undefined : r.str(s, `segmentLabels[${i}]`, 4)));
  } else return r.fail('segmentLabels must be "letters", "none" or a list with one entry per segment');
  const segments = kinds.map((kind, i): HeatSegment => ({ x0: corners[i][0], t0: corners[i][1], x1: corners[i + 1][0], t1: corners[i + 1][1], kind, label: names[i] }));

  const xEnd = corners[n][0];
  const temps = corners.map((c) => c[1]);
  const xMaxGiven = r.optNum(p.xMax, 'xMax');
  if (xMaxGiven !== undefined && xMaxGiven < xEnd) r.fail(`xMax (${xMaxGiven}) is before the end of the curve (${numStr(xEnd, 3)})`);
  const xb = niceBounds(corners[0][0] >= 0 ? 0 : corners[0][0], xMaxGiven ?? xEnd, 8);
  const yGiven = r.optRange(p.yRange, 'yRange');
  if (yGiven && (yGiven[0] > Math.min(...temps) || yGiven[1] < Math.max(...temps))) r.fail('yRange does not contain the whole curve');
  const yb = niceBounds(Math.min(...temps), Math.max(...temps), 8);
  const xNumbers = r.bool(p.xNumbers, 'xNumbers', true);
  const yNumbers = r.bool(p.yNumbers, 'yNumbers', true);
  // An unnumbered axis has no gridline to end on: a little air round the curve instead.
  const tSpan = Math.max(...temps) - Math.min(...temps);
  const xRange: [number, number] = [xb.min, xMaxGiven ?? (xNumbers ? xb.max : xEnd + (xEnd - xb.min) * 0.05)];
  const yRange: [number, number] = yGiven ?? (yNumbers ? [yb.min, yb.max] : [Math.min(...temps) - tSpan * 0.1, Math.max(...temps) + tSpan * 0.1]);
  const at = (x: number): number => {
    const s = segments.find((g) => x >= g.x0 - 1e-12 && x <= g.x1 + 1e-12) as HeatSegment;
    return s.t0 + ((s.t1 - s.t0) * (x - s.x0)) / (s.x1 - s.x0);
  };
  const marks = (p.marks === undefined || p.marks === null ? [] : r.list(p.marks, 'marks', 0, 5)).map((mv, i) => {
    const o = r.obj(mv, `marks[${i}]`);
    const x = r.num(o.x, `marks[${i}].x`);
    if (x < corners[0][0] || x > xEnd) r.fail(`marks[${i}].x (${x}) is not on the curve (${numStr(corners[0][0], 3)} to ${numStr(xEnd, 3)})`);
    return { x, t: at(x), label: r.optStr(o.label, `marks[${i}].label`, 4) };
  });
  const tempUnit = r.optStr(p.tempUnit, 'tempUnit', 6) ?? '°C';
  const xUnit = xQuantity === 'time' ? timeUnit : heatUnit;
  const xWord = xQuantity === 'time' ? 'Time' : cooling ? 'Heat removed' : 'Heat added';
  const plateauLabels = pick(p.plateauLabels, 'plateauLabels', SHOWS, 'none');
  return {
    cooling, computed, xQuantity, heatUnit, timeUnit, heatPerX, mass, segments, xNumbers, yNumbers, plateauLabels, marks, xRange, yRange,
    xStep: r.optStep(p.xStep, 'xStep') ?? xb.step, yStep: r.optStep(p.yStep, 'yStep') ?? yb.step, tempUnit,
    xLabel: r.optStr(p.xLabel, 'xLabel', 60) ?? (xNumbers ? `${xWord} (${xUnit})` : xWord),
    yLabel: r.optStr(p.yLabel, 'yLabel', 60) ?? (yNumbers ? `Temperature (${tempUnit})` : 'Temperature'),
    title: r.optStr(p.title, 'title', 160),
  };
}

export const isPlateau = (s: HeatSegment): boolean => s.t0 === s.t1;

/**
 * How the grid is drawn, from where the curve's corners and marks sit: one on a LIGHTER line (between
 * two numbers) makes the grid one step darker, so the value can be read off that line (`strongGrid`
 * overrides). A corner of a curve given by `corners` that is on no line of an axis whose step the spec
 * fixed is reported: it can only be estimated. A curve whose corners are all on numbered lines — and
 * a computed curve, whose corners fall where the substance puts them — is drawn as ever.
 */
export function heatingGrid(m: HeatingModel, r: Reader): { strong: boolean; note?: Notes[number] } {
  const p = r.p;
  const asked = p.strongGrid === undefined || p.strongGrid === null ? undefined : r.bool(p.strongGrid, 'strongGrid', false);
  const corners: Array<[number, number]> = [[m.segments[0].x0, m.segments[0].t0], ...m.segments.map((s): [number, number] => [s.x1, s.t1])];
  const xs = m.xNumbers ? [...corners.map((c) => c[0]), ...m.marks.map((k) => k.x)] : [];
  const ys = m.yNumbers ? corners.map((c) => c[1]) : [];
  const places = [...xs.map((v) => gridPlace(v, m.xStep)), ...ys.map((v) => gridPlace(v, m.yStep))];
  const strong = asked ?? places.includes('minor');
  if (m.computed) return { strong };
  const offX = p.xStep !== undefined && p.xStep !== null ? corners.filter((c) => m.xNumbers && gridPlace(c[0], m.xStep) === 'off').map((c) => `x = ${numStr(c[0], 3)}`) : [];
  const offY = p.yStep !== undefined && p.yStep !== null ? [...new Set(ys.filter((v) => gridPlace(v, m.yStep) === 'off'))].map((v) => `${numStr(v, 3)} ${m.tempUnit}`) : [];
  const off = [...offX, ...offY];
  if (off.length === 0) return { strong };
  return { strong, note: { code: 'off_grid', message: `corners: ${off.slice(0, 4).join(', ')}${off.length > 4 ? ', …' : ''} ${off.length === 1 ? 'is' : 'are'} on no gridline (the lines are ${numStr(minorStepOf(m.xStep), 4)} apart across and ${numStr(minorStepOf(m.yStep), 4)} ${m.tempUnit} apart up) — move the corner onto a line or change the step` } };
}

export function renderHeatingCurve(r: Reader, _uid?: string): Drawn {
  const m = heatingModel(r);
  const notes: Notes = [];
  const grid = heatingGrid(m, r);
  if (grid.note) notes.push(grid.note);
  const f: Frame = buildFrame({
    xRange: m.xRange, yRange: m.yRange, xStep: m.xStep, yStep: m.yStep, xLabel: m.xLabel, yLabel: m.yLabel, title: m.title,
    xNumbers: m.xNumbers, yNumbers: m.yNumbers, zeroAxes: false, aspect: 0.82, ...(grid.strong ? { minorGridStrong: true } : {}),
  });
  const color = SERIES_COLORS[0];
  const parts: string[] = [f.svg];
  const pts = [m.segments[0], ...m.segments].map((s, i) => (i === 0 ? [f.X(s.x0), f.Y(s.t0)] : [f.X(s.x1), f.Y(s.t1)]));
  parts.push(`<path d="${pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${n2(x)},${n2(y)}`).join('')}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linejoin="round"/>`);
  const up = m.cooling ? -1 : 1;
  m.segments.forEach((s, i) => {
    const xa = f.X(s.x0);
    const xb = f.X(s.x1);
    const ya = f.Y(s.t0);
    const yb = f.Y(s.t1);
    const len = Math.hypot(xb - xa, yb - ya);
    if (len < 16 && (s.label || (isPlateau(s) && m.plateauLabels !== 'none'))) notes.push({ code: 'crowded', message: `segment ${i + 1} is drawn only ${Math.round(len)} units long — its label has no room; change the amounts so every stage shows` });
    const flat = isPlateau(s);
    if (s.label) {
      // A plateau's letter sits over its middle; a sloped segment's on the side the curve bends away from.
      const mx = (xa + xb) / 2;
      const my = (ya + yb) / 2;
      if (flat) parts.push(text(mx, my - 7, s.label, { fs: LABEL_FS, anchor: 'middle', weight: 700, halo: true }));
      else parts.push(text(mx + 8, my + up * (LABEL_FS + 1) + (up < 0 ? LABEL_FS * 0.7 : 0), s.label, { fs: LABEL_FS, anchor: 'start', weight: 700, halo: true }));
    }
    if (flat && m.plateauLabels !== 'none') {
      // Under the plateau, at the end the curve LEAVES upward from (heating: the right end; cooling: the left end) — clear of the curve.
      const s2 = m.plateauLabels === 'blank' ? '?' : `${numStr(s.t0, 2)} ${m.tempUnit}`;
      parts.push(up > 0 ? lab(xb - 2, ya + TICK_FS + 6, s2, 'end', { halo: true }) : lab(xa + 2, ya + TICK_FS + 6, s2, 'start', { halo: true }));
    }
  });
  for (const mk of m.marks) {
    const cx = f.X(mk.x);
    const cy = f.Y(mk.t);
    parts.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="5.9" fill="#ffffff"/><circle cx="${n2(cx)}" cy="${n2(cy)}" r="3.8" fill="${INK}"/>`);
    if (mk.label) {
      // On a plateau: under the dot (the segment's letter is over the plateau). On a slope: on the side away from the segment's letter.
      const flat = m.segments.some((s) => isPlateau(s) && mk.x >= s.x0 && mk.x <= s.x1);
      parts.push(flat ? text(cx, cy + LABEL_FS + 8, mk.label, { fs: LABEL_FS, anchor: 'middle', weight: 700, halo: true })
        : text(cx - 8, cy + (up > 0 ? -5 : LABEL_FS + 5), mk.label, { fs: LABEL_FS, anchor: 'end', weight: 700, halo: true }));
    }
  }
  return { body: parts.join(''), H: f.bottom, facts: { curveCount: 1, marks: [], curves: [], notes, plot: f.plot } };
}
