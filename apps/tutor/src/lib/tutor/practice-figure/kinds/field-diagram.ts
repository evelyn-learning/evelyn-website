/**
 * field_diagram — electric and magnetic fields.
 *
 * variant 'point_charges' — field lines of 1–3 point charges, traced from the
 *   field itself; the number of lines on a charge is proportional to its size:
 *   { charges: Array<{ x: number; y: number;
 *                      q: number;                 // whole number of charge units, −4…4, not 0
 *                      label?: string;            // printed under the charge ("q₁", "+2q")
 *                      showSign?: boolean (true) }>;   // false: an empty circle (the sign is the question)
 *     xRange?: [min, max]; yRange?: [min, max];   // default: round the charges
 *     linesPerUnit?: number (8);                  // 4–12
 *     arrows?: boolean (true);                    // arrowheads on the lines
 *     points?: Array<{ x: number; y: number; label: string }>;   // marked points ("P")
 *     equipotentials?: Array<[x, y]> }            // ≤ 4 dashed curves, each through that point
 * variant 'uniform' — the field between two parallel plates:
 *   { direction: 'up' | 'down' | 'left' | 'right';     // of the field (from the + plate to the − plate)
 *     showSigns?: boolean (true);                 // + and − along the plates
 *     showField?: boolean (true);                 // the field arrows (false: plates only)
 *     separation?: { value: number; unit?: string ('cm'); show?: 'value' | 'blank' | 'none' ('value') };
 *     voltage?: { value: number; show?: 'value' | 'blank' | 'none' ('value') };   // volts
 *     charge?: MovingCharge }                     // a charge between the plates (no velocity needed)
 * variant 'wire' — the magnetic field of a long straight wire:
 *   { view: 'cross_section'; current: 'out' | 'in';    // the wire seen end-on: rings round it
 *     showCurrent?: boolean (true);               // the ⊙ / ⊗ in the wire
 *     showDirection?: boolean (true);             // arrowheads on the rings
 *     point?: { side: 'above' | 'below' | 'left' | 'right'; label?: string ('P') } }
 * | { view: 'side'; current: 'left' | 'right' | 'up' | 'down';   // the wire in the page: ⊙ on one side, ⊗ on the other
 *     showCurrent?: boolean (true);               // the current arrow and its "I"
 *     showField?: boolean (true) }                // the ⊙ / ⊗ symbols
 * variant 'magnetic_force' — a charge moving in a uniform magnetic field:
 *   { field: 'into' | 'out' | 'up' | 'down' | 'left' | 'right';
 *     showField?: boolean (true);
 *     charge: MovingCharge & { velocity: 'up' | 'down' | 'left' | 'right' } }
 * variant 'bar_magnet' — one bar magnet, or two end to end: see ./bar-magnet.ts.
 * MovingCharge = { sign: '+' | '−' | '-'; label?: string; showSign?: boolean (true);
 *                  showForce?: boolean (false) }  // the force arrow is hidden unless asked for
 * Common: title?: string.
 *
 * ⊙ is a field (or current, or force) out of the page, ⊗ into it; a key
 * under the figure says so whenever one is drawn.
 */
import { FIGURE_WIDTH, SERIES_COLORS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, text, titleBlock } from './draw';
import { SHOWS, facts, head, lab, numStr, polyPath, stroke, type Notes, type Pt, type Show } from './draw2';
import { renderBarMagnet } from './bar-magnet';

export const DIRS4 = ['up', 'down', 'left', 'right'] as const;
export type Dir4 = (typeof DIRS4)[number];
export type Dir6 = Dir4 | 'into' | 'out';
export const DIR_VEC: Record<Dir6, [number, number, number]> = { right: [1, 0, 0], left: [-1, 0, 0], up: [0, 1, 0], down: [0, -1, 0], out: [0, 0, 1], into: [0, 0, -1] };
/** The direction a vector along one axis points, or null for the zero vector. */
export function dirOf(v: [number, number, number]): Dir6 | null {
  for (const d of Object.keys(DIR_VEC) as Dir6[]) if (DIR_VEC[d].every((c, i) => Math.sign(c) === Math.sign(v[i]))) return d;
  return null;
}
export const cross = (a: [number, number, number], b: [number, number, number]): [number, number, number] => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

export interface PointCharge { x: number; y: number; q: number; label?: string; showSign: boolean }
export interface MovingCharge { positive: boolean; label?: string; showSign: boolean; showForce: boolean; velocity?: Dir4 }
export type FieldModel =
  | { variant: 'point_charges'; charges: PointCharge[]; xRange: [number, number]; yRange: [number, number]; linesPerUnit: number; arrows: boolean; points: Array<{ x: number; y: number; label: string }>; equipotentials: Pt[]; title?: string }
  | { variant: 'uniform'; direction: Dir4; showSigns: boolean; showField: boolean; separation?: { value: number; unit: string; show: Show }; voltage?: { value: number; show: Show }; charge?: MovingCharge; title?: string }
  | { variant: 'wire'; view: 'cross_section'; current: 'out' | 'in'; showCurrent: boolean; showDirection: boolean; point?: { side: 'above' | 'below' | 'left' | 'right'; label: string }; title?: string }
  | { variant: 'wire'; view: 'side'; current: Dir4; showCurrent: boolean; showField: boolean; title?: string }
  | { variant: 'magnetic_force'; field: Dir6; showField: boolean; charge: MovingCharge & { velocity: Dir4 }; title?: string };

const VARIANTS = ['point_charges', 'uniform', 'wire', 'magnetic_force'] as const;

/** The electric field of the charges at (x, y), in units of k·(charge unit)/(length unit)². */
export function fieldAt(charges: ReadonlyArray<{ x: number; y: number; q: number }>, x: number, y: number): Pt {
  let ex = 0;
  let ey = 0;
  for (const c of charges) {
    const dx = x - c.x;
    const dy = y - c.y;
    const d3 = Math.hypot(dx, dy) ** 3;
    if (d3 < 1e-12) continue;
    ex += (c.q * dx) / d3;
    ey += (c.q * dy) / d3;
  }
  return [ex, ey];
}

/** The force on a charge moving with `velocity` in a magnetic field along `field` (right-hand rule; reversed for a negative charge). */
export function magneticForceDirection(positive: boolean, velocity: Dir6, field: Dir6): Dir6 | null {
  const f = cross(DIR_VEC[velocity], DIR_VEC[field]);
  return dirOf(positive ? f : [-f[0], -f[1], -f[2]]);
}

/** Direction of the field of a straight wire seen end-on, at a point beside it. */
export function wireFieldDirection(current: 'out' | 'in', side: 'above' | 'below' | 'left' | 'right'): Dir4 {
  // Out of the page: counter-clockwise. B = I × r̂.
  const rHat = DIR_VEC[side === 'above' ? 'up' : side === 'below' ? 'down' : side];
  return dirOf(cross(DIR_VEC[current === 'out' ? 'out' : 'into'], rHat)) as Dir4;
}
/** For a wire in the page: the field on one side of it is out of, or into, the page. */
export function wireSideField(current: Dir4, side: 'above' | 'below' | 'left' | 'right'): 'into' | 'out' {
  const rHat = DIR_VEC[side === 'above' ? 'up' : side === 'below' ? 'down' : side];
  return dirOf(cross(DIR_VEC[current], rHat)) as 'into' | 'out';
}

export function fieldModel(r: Reader): FieldModel {
  const p = r.p;
  if (!VARIANTS.includes(p.variant as (typeof VARIANTS)[number])) r.fail(`variant must be one of ${VARIANTS.join(', ')}, bar_magnet`);
  const title = r.optStr(p.title, 'title', 160);
  const pick = <T extends string>(v: unknown, name: string, allowed: readonly T[]): T => {
    if (!allowed.includes(v as T)) r.fail(`${name} must be one of ${allowed.join(', ')}`);
    return v as T;
  };
  const showOf = (v: unknown, name: string): Show => (v === undefined || v === null ? 'value' : pick(v, name, SHOWS));
  const charge = (v: unknown, name: string): MovingCharge => {
    const o = r.obj(v, name);
    const sign = pick(o.sign, `${name}.sign`, ['+', '−', '-'] as const);
    return { positive: sign === '+', label: r.optStr(o.label, `${name}.label`, 6), showSign: r.bool(o.showSign, `${name}.showSign`, true), showForce: r.bool(o.showForce, `${name}.showForce`, false), velocity: o.velocity === undefined ? undefined : pick(o.velocity, `${name}.velocity`, DIRS4) };
  };
  switch (p.variant as (typeof VARIANTS)[number]) {
    case 'point_charges': {
      const charges = r.list(p.charges, 'charges', 1, 3).map((raw, i): PointCharge => {
        const o = r.obj(raw, `charges[${i}]`);
        const q = r.num(o.q, `charges[${i}].q`);
        if (!Number.isInteger(q) || q === 0 || Math.abs(q) > 4) r.fail(`charges[${i}].q must be a whole number from −4 to 4, not 0`);
        return { x: r.num(o.x, `charges[${i}].x`), y: r.num(o.y, `charges[${i}].y`), q, label: r.optStr(o.label, `charges[${i}].label`, 6), showSign: r.bool(o.showSign, `charges[${i}].showSign`, true) };
      });
      charges.forEach((c, i) => charges.slice(0, i).forEach((d) => { if (Math.hypot(c.x - d.x, c.y - d.y) < 1e-9) r.fail(`charges[${i}] is at the same place as another charge`); }));
      const xs = charges.map((c) => c.x);
      const ys = charges.map((c) => c.y);
      const spread = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys), 2);
      const m = spread * 0.75;
      const xRange = r.optRange(p.xRange, 'xRange') ?? [Math.min(...xs) - m, Math.max(...xs) + m];
      const yRange = r.optRange(p.yRange, 'yRange') ?? [Math.min(...ys) - m * 0.8, Math.max(...ys) + m * 0.8];
      charges.forEach((c, i) => { if (c.x <= xRange[0] || c.x >= xRange[1] || c.y <= yRange[0] || c.y >= yRange[1]) r.fail(`charges[${i}] is outside xRange / yRange`); });
      const linesPerUnit = r.optNum(p.linesPerUnit, 'linesPerUnit') ?? 8;
      if (!Number.isInteger(linesPerUnit) || linesPerUnit < 4 || linesPerUnit > 12) r.fail('linesPerUnit must be a whole number from 4 to 12');
      const inside = (x: number, y: number, name: string) => { if (x < xRange[0] || x > xRange[1] || y < yRange[0] || y > yRange[1]) r.fail(`${name} is outside xRange / yRange`); };
      const points = (p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 4)).map((raw, i) => {
        const o = r.obj(raw, `points[${i}]`);
        const q = { x: r.num(o.x, `points[${i}].x`), y: r.num(o.y, `points[${i}].y`), label: r.str(o.label, `points[${i}].label`, 4) };
        inside(q.x, q.y, `points[${i}]`);
        return q;
      });
      const equipotentials = (p.equipotentials === undefined || p.equipotentials === null ? [] : r.list(p.equipotentials, 'equipotentials', 0, 4)).map((raw, i): Pt => {
        if (!Array.isArray(raw) || raw.length !== 2) r.fail(`equipotentials[${i}] must be [x, y]`);
        const q: Pt = [r.num((raw as unknown[])[0], `equipotentials[${i}][0]`), r.num((raw as unknown[])[1], `equipotentials[${i}][1]`)];
        inside(q[0], q[1], `equipotentials[${i}]`);
        return q;
      });
      return { variant: 'point_charges', charges, xRange, yRange, linesPerUnit, arrows: r.bool(p.arrows, 'arrows', true), points, equipotentials, title };
    }
    case 'uniform': {
      let separation: { value: number; unit: string; show: Show } | undefined;
      if (p.separation !== undefined && p.separation !== null) {
        const o = r.obj(p.separation, 'separation');
        separation = { value: r.positive(o.value, 'separation.value'), unit: r.optStr(o.unit, 'separation.unit', 4) ?? 'cm', show: showOf(o.show, 'separation.show') };
      }
      let voltage: { value: number; show: Show } | undefined;
      if (p.voltage !== undefined && p.voltage !== null) {
        const o = r.obj(p.voltage, 'voltage');
        voltage = { value: r.positive(o.value, 'voltage.value'), show: showOf(o.show, 'voltage.show') };
      }
      return { variant: 'uniform', direction: pick(p.direction, 'direction', DIRS4), showSigns: r.bool(p.showSigns, 'showSigns', true), showField: r.bool(p.showField, 'showField', true), separation, voltage, charge: p.charge === undefined || p.charge === null ? undefined : charge(p.charge, 'charge'), title };
    }
    case 'wire': {
      const view = pick(p.view, 'view', ['cross_section', 'side'] as const);
      if (view === 'side') return { variant: 'wire', view, current: pick(p.current, 'current', DIRS4), showCurrent: r.bool(p.showCurrent, 'showCurrent', true), showField: r.bool(p.showField, 'showField', true), title };
      let point: { side: 'above' | 'below' | 'left' | 'right'; label: string } | undefined;
      if (p.point !== undefined && p.point !== null) {
        const o = r.obj(p.point, 'point');
        point = { side: pick(o.side, 'point.side', ['above', 'below', 'left', 'right'] as const), label: r.optStr(o.label, 'point.label', 4) ?? 'P' };
      }
      const m = { variant: 'wire' as const, view, current: pick(p.current, 'current', ['out', 'in'] as const), showCurrent: r.bool(p.showCurrent, 'showCurrent', true), showDirection: r.bool(p.showDirection, 'showDirection', true), point, title };
      if (!m.showCurrent && !m.showDirection) r.fail('showCurrent and showDirection are both false — nothing on the figure fixes the direction');
      return m;
    }
    default: {
      const c = charge(p.charge, 'charge');
      if (!c.velocity) r.fail("charge.velocity must be one of up, down, left, right");
      const field = pick(p.field, 'field', ['into', 'out', ...DIRS4] as const);
      return { variant: 'magnetic_force', field, showField: r.bool(p.showField, 'showField', true), charge: c as MovingCharge & { velocity: Dir4 }, title };
    }
  }
}

// ---------------------------------------------------------------------------
// Field lines
// ---------------------------------------------------------------------------

export interface FieldLine {
  /** Points from where the field leaves to where it arrives (the direction of the field). */
  pts: Pt[];
  /** Index of the charge it leaves from / arrives at; −1 = the edge of the picture. */
  from: number;
  to: number;
}

/** The field lines of a point-charge model, in true coordinates. `r0` is the radius of a charge's symbol. */
export function traceFieldLines(m: Extract<FieldModel, { variant: 'point_charges' }>, r0: number): FieldLine[] {
  const { charges, xRange, yRange } = m;
  const h = Math.max(xRange[1] - xRange[0], yRange[1] - yRange[0]) / 700;
  const lines: FieldLine[] = [];
  const nearest = (i: number): number => {
    let best = 0;
    let bd = Infinity;
    charges.forEach((c, j) => {
      const d = Math.hypot(c.x - charges[i].x, c.y - charges[i].y);
      if (j !== i && d < bd) { bd = d; best = Math.atan2(c.y - charges[i].y, c.x - charges[i].x); }
    });
    return best;
  };
  // A line that leaves the picture is followed on for a while (to 1.5 pictures beyond each edge):
  // `back` is the charge it comes back to end on, with the whole path — a long loop round a smaller charge.
  const [mx, my] = [(xRange[1] - xRange[0]) * 1.5, (yRange[1] - yRange[0]) * 1.5];
  const trace = (i: number, angle: number, sgn: 1 | -1): { pts: Pt[]; end: number; back?: { pts: Pt[]; end: number } } => {
    let x = charges[i].x + r0 * Math.cos(angle);
    let y = charges[i].y + r0 * Math.sin(angle);
    const pts: Pt[] = [[x, y]];
    let cut: Pt[] | null = null;
    for (let step = 0; step < (cut ? 16000 : 6000); step++) {
      const [ax, ay] = fieldAt(charges, x, y);
      const al = Math.hypot(ax, ay);
      if (al < 1e-9) break;
      const hx = x + (sgn * h * ax) / al / 2;
      const hy = y + (sgn * h * ay) / al / 2;
      const [bx, by] = fieldAt(charges, hx, hy);
      const bl = Math.hypot(bx, by);
      if (bl < 1e-9) break;
      x += (sgn * h * bx) / bl;
      y += (sgn * h * by) / bl;
      if (!cut && (x < xRange[0] || x > xRange[1] || y < yRange[0] || y > yRange[1])) cut = [...pts, [Math.max(xRange[0], Math.min(xRange[1], x)), Math.max(yRange[0], Math.min(yRange[1], y))]];
      if (cut && (x < xRange[0] - mx || x > xRange[1] + mx || y < yRange[0] - my || y > yRange[1] + my)) break;
      pts.push([x, y]);
      const hit = charges.findIndex((c, j) => j !== i && Math.hypot(x - c.x, y - c.y) < r0);
      if (hit >= 0) return cut ? { pts: cut, end: -1, back: { pts, end: hit } } : { pts, end: hit };
    }
    return cut ? { pts: cut, end: -1 } : { pts, end: -2 };
  };
  // The smaller charges first (of equal ones the positive first): every line of a charge is started
  // evenly round IT, so a small charge beside a large one has lines on all its sides; a line that
  // ends on a charge already done is that charge's line and is not drawn twice. A line that leaves
  // the picture and loops back to a LARGER charge is drawn in both its visible stretches (it is a
  // line of both charges, so both keep their counts); between equal charges each end is drawn to
  // the edge from its own charge, as it always was.
  const order = charges.map((_, i) => i).sort((a, b) => Math.abs(charges[a].q) - Math.abs(charges[b].q) || charges[b].q - charges[a].q || a - b);
  const done = new Set<number>();
  const mine: FieldLine[][] = charges.map(() => []);
  const size = (j: number): number => Math.abs(charges[j].q);
  for (const i of order) {
    const c = charges[i];
    const n = Math.abs(c.q) * m.linesPerUnit;
    const base = nearest(i);
    for (let j = 0; j < n; j++) {
      let t = trace(i, base + (2 * Math.PI * (j + 0.5)) / n, c.q > 0 ? 1 : -1);
      if (t.end >= 0 && done.has(t.end)) continue;
      // (Two charges only: with three the loops crowd the lines already there.)
      if (t.back && charges.length === 2) {
        if (size(t.back.end) > size(i)) t = t.back;
        else if (size(t.back.end) < size(i) && done.has(t.back.end)) continue;
      }
      mine[i].push(c.q > 0 ? { pts: t.pts, from: i, to: t.end } : { pts: [...t.pts].reverse(), from: t.end, to: i });
    }
    done.add(i);
  }
  for (const list of mine) lines.push(...list);
  return lines;
}

/** The stretches of a traced line that lie inside the picture (one, unless it left and came back). */
export function visibleRuns(pts: Pt[], xRange: [number, number], yRange: [number, number]): Pt[][] {
  const eps = 1e-9;
  const inside = (q: Pt): boolean => q[0] >= xRange[0] - eps && q[0] <= xRange[1] + eps && q[1] >= yRange[0] - eps && q[1] <= yRange[1] + eps;
  const clamp = (q: Pt): Pt => [Math.max(xRange[0], Math.min(xRange[1], q[0])), Math.max(yRange[0], Math.min(yRange[1], q[1]))];
  if (pts.every(inside)) return [pts];
  const runs: Pt[][] = [];
  let run: Pt[] = [];
  pts.forEach((q, i) => {
    if (inside(q)) {
      if (run.length === 0 && i > 0) run.push(clamp(pts[i - 1]));
      run.push(q);
    } else if (run.length) {
      run.push(clamp(q));
      runs.push(run);
      run = [];
    }
  });
  if (run.length) runs.push(run);
  return runs.filter((x) => x.length >= 2);
}

/** Radius of a charge's symbol, and the scale (canvas units per unit of the model) a point-charge figure is drawn at. */
export const CHARGE_RADIUS = 10;
export function fieldScale(m: Extract<FieldModel, { variant: 'point_charges' }>): number {
  return Math.min((FIGURE_WIDTH - 24) / (m.xRange[1] - m.xRange[0]), 260 / (m.yRange[1] - m.yRange[0]));
}

/** How many lines of the DRAWN figure leave (or arrive at) each charge — what a student counts. It is the
 *  charge's size × linesPerUnit whenever the lines that join two charges stay inside the picture; a figure
 *  where it is not carries a legibility note. */
export function lineCounts(m: Extract<FieldModel, { variant: 'point_charges' }>): number[] {
  const lines = traceFieldLines(m, CHARGE_RADIUS / fieldScale(m));
  return m.charges.map((_, i) => lines.filter((ln) => ln.from === i || ln.to === i).length);
}
/** The same by the charges' sizes alone: |q| × linesPerUnit. */
export function nominalLineCounts(m: Extract<FieldModel, { variant: 'point_charges' }>): number[] {
  return m.charges.map((c) => Math.abs(c.q) * m.linesPerUnit);
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

const FORCE = SERIES_COLORS[1];

/** ⊙ (out of the page) or ⊗ (into it), radius r. */
function pageSymbol(cx: number, cy: number, out: boolean, r = 6, color: string = INK): string {
  const ring = `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="#ffffff" stroke="${color}" stroke-width="1.3"/>`;
  if (out) return ring + `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r * 0.33)}" fill="${color}"/>`;
  const k = r * 0.62;
  return ring + `<path d="M${n2(cx - k)},${n2(cy - k)}L${n2(cx + k)},${n2(cy + k)}M${n2(cx - k)},${n2(cy + k)}L${n2(cx + k)},${n2(cy - k)}" ${stroke(color, 1.3)}/>`;
}
function pageKey(parts: string[], y: number, what: string, W: number): number {
  parts.push(pageSymbol(18, y + 7, true, 5.5), text(28, y + 11, `${what} out of the page`, {}), pageSymbol(W / 2 + 10, y + 7, false, 5.5), text(W / 2 + 20, y + 11, `${what} into the page`, {}));
  return y + 22;
}
function chargeSymbol(cx: number, cy: number, c: { positive: boolean; showSign: boolean }, r = 10): string {
  return `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${r}" fill="#ffffff" stroke="${INK}" stroke-width="1.9"/>` + (c.showSign ? text(cx, cy + 4.8, c.positive ? '+' : '−', { fs: 14, anchor: 'middle', weight: 700 }) : '');
}
const UNIT: Record<Dir4, Pt> = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] };
/** A heavy labelled arrow from (x, y) along a direction, length L. */
function vecArrow(x: number, y: number, d: Dir4, L: number, color: string, label: string, dash?: string): string {
  const [ux, uy] = UNIT[d];
  const ex = x + ux * L;
  const ey = y + uy * L;
  return `<path d="M${n2(x)},${n2(y)}L${n2(ex - ux * 7)},${n2(ey - uy * 7)}" ${stroke(color, 2.8, dash)}/>` + head(ex, ey, ux, uy, 11, color)
    + text(ex + ux * 9 + (ux === 0 ? 9 : 0), ey + uy * 9 + 4 + (uy === 0 ? -9 : 0), label, { fs: 13, anchor: 'middle', weight: 700, italic: true, fill: color, halo: true });
}

/**
 * Where the letter of a marked point goes: the first of the places round the mark (up and to the
 * right first — where it always went) whose box no field line crosses, that is clear of every
 * `obstacle` and inside `bounds`. `clear` is false when every place is crossed (the one crossed
 * least is used). `radius`: of the mark itself, when it is larger than a dot (a compass).
 */
export function clearLabelSpot(px: number, py: number, label: string, lines: ReadonlyArray<ReadonlyArray<Pt>>, obstacles: ReadonlyArray<{ x0: number; y0: number; x1: number; y1: number }>, bounds: { x0: number; y0: number; x1: number; y1: number }, leftFirst = false, radius = 0): { x: number; y: number; anchor: 'start' | 'end'; clear: boolean } {
  const w = Math.max(9, estWidth(label, 13) * 0.9);
  const k = radius * 0.72;
  const spots: Array<{ x: number; y: number; anchor: 'start' | 'end' }> = [];
  const pair = (dx: number, dy: number) => {
    const a = { x: px + dx, y: py + dy, anchor: 'start' as const };
    const b = { x: px - dx, y: py + dy, anchor: 'end' as const };
    spots.push(...(leftFirst ? [b, a] : [a, b]));
  };
  pair(7 + k, -6 - k);
  pair(7 + k, 15 + k);
  pair(8 + radius, 4.5);
  for (const out of [6, 12, 18]) {
    pair(7 + k, -6 - k - out);
    pair(7 + k, 15 + k + out);
    pair(8 + radius + out, 4.5);
    spots.push({ x: px - w / 2, y: py - 8 - radius - out, anchor: 'start' }, { x: px - w / 2, y: py + 17 + radius + out, anchor: 'start' });
  }
  const boxOf = (c: { x: number; y: number; anchor: 'start' | 'end' }) => (c.anchor === 'start' ? { x0: c.x - 2, y0: c.y - 12, x1: c.x + w + 2, y1: c.y + 4 } : { x0: c.x - w - 2, y0: c.y - 12, x1: c.x + 2, y1: c.y + 4 });
  /** How many lines cross the box of a place; Infinity when it is off the figure or on an obstacle. */
  const crossed = (c: { x: number; y: number; anchor: 'start' | 'end' }): number => {
    const b = boxOf(c);
    if (b.x0 < bounds.x0 || b.x1 > bounds.x1 || b.y0 < bounds.y0 || b.y1 > bounds.y1) return Infinity;
    if (obstacles.some((o) => b.x0 < o.x1 && o.x0 < b.x1 && b.y0 < o.y1 && o.y0 < b.y1)) return Infinity;
    let count = 0;
    for (const ln of lines) {
      let hit = false;
      for (let i = 0; i < ln.length && !hit; i++) {
        const q = ln[i];
        if (q[0] > b.x0 && q[0] < b.x1 && q[1] > b.y0 && q[1] < b.y1) hit = true;
        // Between two points that are far apart (a thinned line), look along the segment as well.
        else if (i > 0 && Math.hypot(q[0] - ln[i - 1][0], q[1] - ln[i - 1][1]) > 3) {
          const n = Math.ceil(Math.hypot(q[0] - ln[i - 1][0], q[1] - ln[i - 1][1]) / 2);
          for (let j = 1; j < n && !hit; j++) {
            const x = ln[i - 1][0] + ((q[0] - ln[i - 1][0]) * j) / n;
            const y = ln[i - 1][1] + ((q[1] - ln[i - 1][1]) * j) / n;
            if (x > b.x0 && x < b.x1 && y > b.y0 && y < b.y1) hit = true;
          }
        }
      }
      if (hit) count++;
    }
    return count;
  };
  let best = spots[0];
  let least = Infinity;
  for (const c of spots) {
    const n = crossed(c);
    if (n === 0) return { ...c, clear: true };
    if (n < least) { least = n; best = c; }
  }
  return { ...best, clear: false };
}

export function renderFieldDiagram(r: Reader): Drawn {
  if (r.p.variant === 'bar_magnet') return renderBarMagnet(r);
  const m = fieldModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const parts: string[] = [];
  const top = t.top + 2;
  let H = top;

  if (m.variant === 'point_charges') {
    const bw = W - 24;
    const k = fieldScale(m);
    const w = (m.xRange[1] - m.xRange[0]) * k;
    const w0 = w;
    const hgt = (m.yRange[1] - m.yRange[0]) * k;
    const x0 = (W - w) / 2;
    const C = (q: Pt): Pt => [x0 + (q[0] - m.xRange[0]) * k, top + (m.yRange[1] - q[1]) * k];
    parts.push(`<rect x="${n2(x0)}" y="${n2(top)}" width="${n2(w)}" height="${n2(hgt)}" fill="none" stroke="#cbd5e1" stroke-width="1"/>`);
    const R = CHARGE_RADIUS;
    const lines = traceFieldLines(m, R / k);
    const total = lines.length;
    if (total > 36) notes.push({ code: 'too_many_elements', message: `${total} field lines — more than 36 cannot be counted at 340 px (fewer linesPerUnit, or smaller charges)` });
    const d: string[] = [];
    /** Every drawn field line, on the canvas — what a label must keep off. */
    const drawn: Pt[][] = [];
    for (const ln of lines) for (const [ri, run] of visibleRuns(ln.pts, m.xRange, m.yRange).entries()) {
      const cp = run.map(C);
      // Thin the polyline: keep a point when the line has turned or run on.
      const kept: Pt[] = [cp[0]];
      let last = 0;
      for (let i = 1; i < cp.length - 1; i++) {
        const a = kept[kept.length - 1];
        const run2 = Math.hypot(cp[i][0] - a[0], cp[i][1] - a[1]);
        const turn = Math.abs(Math.atan2(cp[i + 1][1] - cp[i][1], cp[i + 1][0] - cp[i][0]) - Math.atan2(cp[last + 1][1] - cp[last][1], cp[last + 1][0] - cp[last][0]));
        if (run2 > 36 || (run2 > 2.5 && Math.min(turn, 2 * Math.PI - turn) > 0.07)) {
          kept.push(cp[i]);
          last = i;
        }
      }
      kept.push(cp[cp.length - 1]);
      drawn.push(cp);
      d.push(polyPath(kept));
      if (m.arrows) {
        let len = 0;
        const seg = kept.map((q, i) => (i === 0 ? 0 : (len += Math.hypot(q[0] - kept[i - 1][0], q[1] - kept[i - 1][1]))));
        if (len > 26) {
          // Nearer the charge it leaves than the middle, where neighbouring lines are still apart
          // (on the stretch of a loop that comes back into the picture: nearer the charge it arrives at).
          const want = ri === 0 ? Math.min(len * 0.5, 46) : Math.max(len * 0.5, len - 46);
          const i = Math.max(1, seg.findIndex((s) => s >= want));
          const f = (want - seg[i - 1]) / (seg[i] - seg[i - 1] || 1);
          const ax = kept[i - 1][0] + (kept[i][0] - kept[i - 1][0]) * f;
          const ay = kept[i - 1][1] + (kept[i][1] - kept[i - 1][1]) * f;
          parts.push(head(ax + (kept[i][0] - kept[i - 1][0]) * 0.001, ay, kept[i][0] - kept[i - 1][0], kept[i][1] - kept[i - 1][1], 7.5, INK));
        }
      }
    }
    parts.unshift(`<path d="${d.join('')}" ${stroke(INK, 1.25)} stroke-linejoin="round"/>`);
    // Equipotentials: perpendicular to the field, both ways from the given point.
    for (const start of m.equipotentials) {
      const step = (m.xRange[1] - m.xRange[0]) / 500;
      const run = (sgn: 1 | -1): { pts: Pt[]; closed: boolean } => {
        let [x, y] = start;
        const pts: Pt[] = [];
        for (let i = 0; i < 6000; i++) {
          const [ex, ey] = fieldAt(m.charges, x, y);
          const el = Math.hypot(ex, ey);
          if (el < 1e-9) break;
          const mx = x + (sgn * step * -ey) / el / 2;
          const my = y + (sgn * step * ex) / el / 2;
          const [fx, fy] = fieldAt(m.charges, mx, my);
          const fl = Math.hypot(fx, fy);
          if (fl < 1e-9) break;
          x += (sgn * step * -fy) / fl;
          y += (sgn * step * fx) / fl;
          if (x < m.xRange[0] || x > m.xRange[1] || y < m.yRange[0] || y > m.yRange[1]) break;
          if (i % 6 === 0) pts.push([x, y]);
          if (i > 20 && Math.hypot(x - start[0], y - start[1]) < step * 1.5) return { pts: [...pts, start], closed: true };
        }
        return { pts, closed: false };
      };
      const a = run(1);
      const all = a.closed ? [start, ...a.pts] : [...run(-1).pts.reverse(), start, ...a.pts];
      parts.push(`<path d="${polyPath(all.map(C))}" ${stroke(MUTED, 1.2, '5 4')}/>`);
    }
    m.charges.forEach((c) => {
      const [cx, cy] = C([c.x, c.y]);
      parts.push(chargeSymbol(cx, cy, { positive: c.q > 0, showSign: c.showSign }, R));
      if (c.label) {
        // On a white plate, so no field line runs through the letters — and the plate itself is
        // put where it cuts the FEWEST lines: under the charge when that is as clear as over it,
        // else over it. (Not beside it: there the plate hides where the lines START, and they
        // look as if they left the label.)
        const w = c.label === '?' ? 0 : estWidth(c.label, 12) * 0.9 + 6;
        const half = (w || 22) / 2;
        const spots: Pt[] = [[cx, cy + R + 16], [cx, cy - R - 7]];
        const cut = ([lx, ly]: Pt): number => {
          if (lx - half < x0 + 1 || lx + half > x0 + w0 - 1 || ly - 11.5 < top + 1 || ly + 3.5 > top + hgt - 1) return Infinity;
          const box = { x0: lx - half - 1, y0: ly - 12.5, x1: lx + half + 1, y1: ly + 4.5 };
          let n = 0;
          for (const ln of drawn) if (ln.some((q) => q[0] > box.x0 && q[0] < box.x1 && q[1] > box.y0 && q[1] < box.y1)) n++;
          for (const o of m.charges) {
            if (o === c) continue;
            const [ox, oy] = C([o.x, o.y]);
            if (ox + R > box.x0 && ox - R < box.x1 && oy + R > box.y0 && oy - R < box.y1) n += 10;
          }
          return n;
        };
        const cuts = spots.map(cut);
        let best = cuts.indexOf(Math.min(...cuts));
        if (cuts[best] > 0) {
          // Neither is clear: look further out, in the gaps BETWEEN this charge's lines (they leave
          // it evenly spaced, starting half a gap from the direction of its nearest neighbour) —
          // nearest the charge first, and at each distance the gap nearest to straight down.
          const n = Math.abs(c.q) * m.linesPerUnit;
          let toward = 0;
          let bd = Infinity;
          for (const o of m.charges) {
            const dist = Math.hypot(o.x - c.x, o.y - c.y);
            if (o !== c && dist < bd) { bd = dist; toward = Math.atan2(o.y - c.y, o.x - c.x); }
          }
          const gaps = Array.from({ length: n }, (_, j) => toward + (2 * Math.PI * j) / n)
            .sort((a, b) => Math.abs(Math.sin(a) + 1) + Math.abs(Math.cos(a)) - (Math.abs(Math.sin(b) + 1) + Math.abs(Math.cos(b))));
          search: for (const rho of [R + 13, R + 19, R + 26, R + 34]) {
            for (const a of gaps) {
              const spot: Pt = [cx + (rho + half * Math.abs(Math.cos(a))) * Math.cos(a), cy - rho * Math.sin(a) + 4];
              if (cut(spot) === 0) {
                spots.push(spot);
                cuts.push(0);
                best = spots.length - 1;
                break search;
              }
            }
          }
        }
        const [lx, ly] = Number.isFinite(cuts[best]) ? spots[best] : spots[cy + R + 16 > top + hgt - 2 ? 1 : 0];
        const lost = cuts[best];
        if (Number.isFinite(lost) && lost > 1) notes.push({ code: 'labels_overlap', message: `the label "${c.label}" of a charge interrupts ${lost} field lines wherever it is put — fewer linesPerUnit, or no label` });
        if (w) parts.push(`<rect x="${n2(lx - w / 2)}" y="${n2(ly - 11.5)}" width="${n2(w)}" height="15" rx="2" fill="#ffffff"/>`);
        parts.push(lab(lx, ly, c.label, 'middle', { fs: 12, weight: 600 }));
      }
    });
    // Counting lines works when each charge's lines leave it well apart and run clear. With THREE
    // charges they bunch in the gaps between the charges however they are started; and more than
    // a dozen lines on one symbol leave it under 5 units apart.
    if (m.charges.length >= 3) notes.push({ code: 'crowded', message: 'three charges: the field lines bunch between them — use this figure for direction and sign, NOT for counting lines (for line counting use one or two charges)' });
    m.charges.forEach((c, i) => {
      const n = Math.abs(c.q) * m.linesPerUnit;
      const met = lines.filter((ln) => ln.from === i || ln.to === i).length;
      if (met !== n && m.charges.length === 2) notes.push({ code: 'not_to_scale', message: `charges[${i}] is drawn with ${met} field lines, not ${n} (lines of the larger charge leave the picture before they reach the smaller one) — widen xRange / yRange before asking for a count or a ratio of lines` });
      if (n > 12) notes.push({ code: 'crowded', message: `charges[${i}] carries ${n} field lines — more than 12 leave its symbol under 5 units apart and cannot be counted at 340 px (fewer linesPerUnit)` });
    });
    const symbols = m.charges.map((c) => { const [cx, cy] = C([c.x, c.y]); return { x0: cx - R - 1, y0: cy - R - 1, x1: cx + R + 1, y1: cy + R + 1 }; });
    for (const q of m.points) {
      const [px, py] = C([q.x, q.y]);
      const at = clearLabelSpot(px, py, q.label, drawn, symbols, { x0: x0 + 1, y0: top + 1, x1: x0 + w0 - 1, y1: top + hgt - 1 }, px > W - 40);
      if (!at.clear) notes.push({ code: 'labels_overlap', message: `the label "${q.label}" of a point has no place clear of the field lines — move the point, or use fewer linesPerUnit` });
      parts.push(`<circle cx="${n2(px)}" cy="${n2(py)}" r="3.4" fill="${INK}" stroke="#ffffff" stroke-width="1.5"/>`, text(at.x, at.y, q.label, { fs: 13, anchor: at.anchor, weight: 700, italic: true, halo: true }));
    }
    if (!m.arrows && m.charges.every((c) => !c.showSign)) notes.push({ code: 'ambiguous_blank', message: 'no arrowheads and no signs — nothing fixes which charges are positive' });
    H = top + hgt + 10;
  } else if (m.variant === 'uniform') {
    const vertical = m.direction === 'up' || m.direction === 'down';
    const cx = W / 2;
    const span = vertical ? 200 : 150;
    const gap = vertical ? 120 : 190;
    const cy = top + 26 + (vertical ? gap / 2 : span / 2);
    const [ux, uy] = UNIT[m.direction];
    // Plates: perpendicular to the field, at ± gap / 2 along it; the + plate is where the field starts.
    const plate = (sgn: 1 | -1, plus: boolean) => {
      const px = cx + ux * sgn * (gap / 2);
      const py = cy + uy * sgn * (gap / 2);
      const [a, b] = vertical ? [[px - span / 2, py], [px + span / 2, py]] : [[px, py - span / 2], [px, py + span / 2]];
      parts.push(`<path d="M${n2(a[0])},${n2(a[1])}L${n2(b[0])},${n2(b[1])}" ${stroke(INK, 4.5)}/>`);
      if (!m.showSigns) return;
      for (let i = 0; i < 5; i++) {
        const f = (i + 0.5) / 5;
        const sx = a[0] + (b[0] - a[0]) * f + ux * sgn * 12;
        const sy = a[1] + (b[1] - a[1]) * f + uy * sgn * 12;
        parts.push(text(sx, sy + 4.5, plus ? '+' : '−', { fs: 13, anchor: 'middle', weight: 700 }));
      }
    };
    plate(-1, true);
    plate(1, false);
    const n = 5;
    const chargeAt: Pt = [cx, cy];
    if (m.showField) {
      for (let i = 0; i < n; i++) {
        const off = ((i + 0.5) / n - 0.5) * span * 0.86;
        const sx = cx + (vertical ? off : 0) - ux * (gap / 2 - 5);
        const sy = cy + (vertical ? 0 : off) - uy * (gap / 2 - 5);
        const ex = sx + ux * (gap - 10);
        const ey = sy + uy * (gap - 10);
        parts.push(`<path d="M${n2(sx)},${n2(sy)}L${n2(ex - ux * 6)},${n2(ey - uy * 6)}" ${stroke(MUTED, 1.4)}/>` + head(ex, ey, ux, uy, 9, MUTED));
      }
      // "E" beside the first arrow.
      const off = -0.5 * span * 0.86 + span * 0.86 * 0.1;
      parts.push(text(cx + (vertical ? off - 9 : -gap * 0.26), cy + (vertical ? gap * 0.2 : off - 7), 'E', { fs: 13, anchor: 'middle', weight: 700, italic: true, halo: true }));
    }
    if (m.charge) {
      // Between two field arrows, so neither runs through the symbol.
      chargeAt[0] += vertical ? span * 0.086 : 0;
      chargeAt[1] += vertical ? 0 : span * 0.086;
      if (m.charge.showForce) {
        const d = (m.charge.positive ? m.direction : ({ up: 'down', down: 'up', left: 'right', right: 'left' } as const)[m.direction]);
        parts.push(vecArrow(chargeAt[0], chargeAt[1], d, 38, FORCE, 'F'));
      }
      parts.push(chargeSymbol(chargeAt[0], chargeAt[1], m.charge));
      if (m.charge.label) parts.push(text(chargeAt[0] + (vertical ? 15 : 0), chargeAt[1] + (vertical ? 4 : 24), m.charge.label, { fs: 12, anchor: vertical ? 'start' : 'middle', weight: 600, halo: true }));
    }
    H = cy + (vertical ? gap / 2 : span / 2) + 26;
    const tail: string[] = [];
    if (m.separation && m.separation.show !== 'none') tail.push(`plate separation d = ${m.separation.show === 'blank' ? '?' : `${numStr(m.separation.value, 3)} ${m.separation.unit}`}`);
    if (m.voltage && m.voltage.show !== 'none') tail.push(`potential difference V = ${m.voltage.show === 'blank' ? '?' : `${numStr(m.voltage.value, 3)} V`}`);
    tail.forEach((s) => {
      parts.push(text(cx, H + 6, s, { fs: 12, anchor: 'middle' }));
      H += 17;
    });
    if (tail.length) H += 4;
    if (!m.showSigns && !m.showField) notes.push({ code: 'ambiguous_blank', message: 'showSigns and showField are both false — nothing fixes the direction of the field' });
  } else if (m.variant === 'wire' && m.view === 'cross_section') {
    const cx = W / 2;
    const cy = top + 112;
    const rings = [34, 62, 96];
    rings.forEach((rr) => {
      parts.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${rr}" ${stroke(INK, 1.3)}/>`);
      if (!m.showDirection) return;
      // Counter-clockwise for a current out of the page; arrowheads at the four diagonals.
      const s = m.current === 'out' ? 1 : -1;
      for (const a of [45, 135, 225, 315]) {
        const x = cx + rr * Math.cos((a * Math.PI) / 180);
        const y = cy - rr * Math.sin((a * Math.PI) / 180);
        const tx = -Math.sin((a * Math.PI) / 180) * s;
        const ty = -Math.cos((a * Math.PI) / 180) * s;
        parts.push(head(x + tx * 4, y + ty * 4, tx, ty, 8, INK));
      }
    });
    parts.push(m.showCurrent ? pageSymbol(cx, cy, m.current === 'out', 10) : `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="10" fill="#ffffff" stroke="${INK}" stroke-width="1.9"/>`);
    parts.push(text(cx, cy + 25, 'wire', { anchor: 'middle', halo: true }));
    if (m.point) {
      const [ux, uy] = UNIT[m.point.side === 'above' ? 'up' : m.point.side === 'below' ? 'down' : m.point.side];
      const px = cx + ux * rings[1];
      const py = cy + uy * rings[1];
      parts.push(`<circle cx="${n2(px)}" cy="${n2(py)}" r="3.6" fill="${INK}" stroke="#ffffff" stroke-width="1.5"/>`, text(px + (ux < 0 ? -8 : 8), py + (uy > 0 ? 15 : -7), m.point.label, { fs: 13, anchor: ux < 0 ? 'end' : 'start', weight: 700, italic: true, halo: true }));
    }
    H = cy + rings[2] + 12;
    if (m.showCurrent) H = pageKey(parts, H, 'current', W);
  } else if (m.variant === 'wire') {
    const horizontal = m.current === 'left' || m.current === 'right';
    const cx = W / 2;
    const cy = top + 100;
    const L = horizontal ? 150 : 92;
    const [ux, uy] = UNIT[m.current];
    if (m.showField) {
      for (const side of [-1, 1] as const) {
        const name = horizontal ? (side < 0 ? 'above' : 'below') : side < 0 ? 'left' : 'right';
        const out = wireSideField(m.current, name) === 'out';
        for (let row = 1; row <= 2; row++) for (let i = 0; i < 5; i++) {
          const along = ((i + 0.5) / 5 - 0.5) * 2 * L * 0.92;
          parts.push(horizontal ? pageSymbol(cx + along, cy + side * row * 30, out) : pageSymbol(cx + side * row * 34, cy + along, out));
        }
      }
    }
    parts.push(`<path d="M${n2(cx - Math.abs(ux) * L)},${n2(cy - Math.abs(uy) * L)}L${n2(cx + Math.abs(ux) * L)},${n2(cy + Math.abs(uy) * L)}" ${stroke(INK, 4)}/>`);
    if (m.showCurrent) {
      // One solid arrowhead, wider than the wire (a white slit drawn behind it once read as a stray stroke).
      parts.push(head(cx + ux * 14, cy + uy * 14, ux, uy, 19, INK));
      // Beyond the end of a horizontal wire; beside the arrowhead of a vertical one (beyond its end
      // the letter fell on — and half outside — the top edge of the figure).
      parts.push(horizontal ? text(cx + ux * (L + 12), cy + 4.5, 'I', { fs: 14, anchor: 'middle', weight: 700, italic: true }) : text(cx - 13, cy + uy * 6 + 5, 'I', { fs: 14, anchor: 'middle', weight: 700, italic: true, halo: true }));
    } else parts.push(text(horizontal ? cx + L + 6 : cx, horizontal ? cy + 4 : cy + L + 14, 'wire', { anchor: horizontal ? 'start' : 'middle' }));
    H = cy + (horizontal ? 72 : L + 20) + 8;
    if (m.showField) H = pageKey(parts, H, 'field', W);
    if (!m.showField && !m.showCurrent) notes.push({ code: 'ambiguous_blank', message: 'showField and showCurrent are both false — the figure shows a bare wire' });
  } else {
    const cx = W / 2;
    const bw = 300;
    const bh = 176;
    const x0 = (W - bw) / 2;
    const cy = top + 6 + bh / 2;
    parts.push(`<rect x="${n2(x0)}" y="${n2(cy - bh / 2)}" width="${bw}" height="${bh}" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="6 4"/>`);
    const inPlane = m.field !== 'into' && m.field !== 'out';
    const force = magneticForceDirection(m.charge.positive, m.charge.velocity, m.field);
    const [vx, vy] = UNIT[m.charge.velocity];
    // What the grid must keep clear of: the charge, its velocity arrow, the force arrow.
    const clear: Array<[number, number, number, number]> = [[cx - 16, cy - 16, cx + 16, cy + 16], [Math.min(cx, cx + vx * 70) - 12, Math.min(cy, cy + vy * 70) - 14, Math.max(cx, cx + vx * 70) + 12, Math.max(cy, cy + vy * 70) + 14]];
    if (m.charge.showForce && force && force !== 'into' && force !== 'out') {
      const [fx, fy] = UNIT[force];
      clear.push([Math.min(cx, cx + fx * 62) - 12, Math.min(cy, cy + fy * 62) - 14, Math.max(cx, cx + fx * 62) + 12, Math.max(cy, cy + fy * 62) + 14]);
    }
    if (m.charge.showForce && force && (force === 'into' || force === 'out')) clear.push([cx - 40, cy + 12, cx + 40, cy + 44]);
    const blocked = (x: number, y: number, pad: number) => clear.some(([a, b, c2, d2]) => x > a - pad && x < c2 + pad && y > b - pad && y < d2 + pad);
    if (m.showField && !inPlane) {
      for (let row = 0; row < 5; row++) for (let col = 0; col < 8; col++) {
        const x = x0 + ((col + 0.5) / 8) * bw;
        const y = cy - bh / 2 + ((row + 0.5) / 5) * bh;
        if (!blocked(x, y, 5)) parts.push(pageSymbol(x, y, m.field === 'out', 6, MUTED));
      }
    } else if (m.showField) {
      const [bx, by] = UNIT[m.field as Dir4];
      const horizontal = bx !== 0;
      const count = horizontal ? 5 : 7;
      for (let i = 0; i < count; i++) {
        const off = ((i + 0.5) / count - 0.5) * (horizontal ? bh : bw);
        const sx = horizontal ? cx - bx * (bw / 2 - 8) : cx + off;
        const sy = horizontal ? cy + off : cy - by * (bh / 2 - 8);
        const ex = horizontal ? cx + bx * (bw / 2 - 8) : sx;
        const ey = horizontal ? sy : cy + by * (bh / 2 - 8);
        // An arrow that would run through the charge or its arrows is left out.
        if ([0.15, 0.3, 0.45, 0.6, 0.75, 0.9].some((f) => blocked(sx + (ex - sx) * f, sy + (ey - sy) * f, 2))) continue;
        parts.push(`<path d="M${n2(sx)},${n2(sy)}L${n2(ex - bx * 6)},${n2(ey - by * 6)}" ${stroke(MUTED, 1.3)}/>` + head(ex, ey, bx, by, 9, MUTED));
      }
      parts.push(text(x0 + 10, cy - bh / 2 + 16, 'B', { fs: 13, weight: 700, italic: true, fill: MUTED, halo: true }));
    } else parts.push(text(x0 + 8, cy - bh / 2 + 16, 'B = ?', { fs: 13, weight: 700, halo: true }));
    if (m.charge.showForce && force) {
      if (force === 'into' || force === 'out') parts.push(pageSymbol(cx - 14, cy + 30, force === 'out', 7, FORCE), text(cx - 2, cy + 34.5, 'F', { fs: 13, weight: 700, italic: true, fill: FORCE, halo: true }));
      else parts.push(vecArrow(cx, cy, force, 60, FORCE, 'F', '7 3'));
    }
    parts.push(vecArrow(cx, cy, m.charge.velocity, 68, INK, 'v'));
    parts.push(chargeSymbol(cx, cy, m.charge));
    if (m.charge.label) parts.push(vx !== 0 ? text(cx, cy - 15, m.charge.label, { fs: 12, anchor: 'middle', weight: 600, halo: true }) : text(cx - 15, cy + 4, m.charge.label, { fs: 12, anchor: 'end', weight: 600, halo: true }));
    H = cy + bh / 2 + 10;
    if ((m.showField && !inPlane) || (m.charge.showForce && (force === 'into' || force === 'out'))) H = pageKey(parts, H, m.showField && !inPlane ? 'field' : 'force', W);
    if (!force) notes.push({ code: 'ambiguous_blank', message: 'the velocity is along the field — there is no magnetic force to ask about' });
    if (!m.showField && !m.charge.showForce) notes.push({ code: 'ambiguous_blank', message: 'showField is false and the force is not shown — nothing fixes either' });
  }
  return { body: t.svg + parts.join(''), H, facts: facts(notes) };
}
