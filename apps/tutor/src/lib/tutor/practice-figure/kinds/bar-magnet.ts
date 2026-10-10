/**
 * field_diagram, variant 'bar_magnet' — the magnetic field of one bar magnet,
 * or of two placed end to end.
 *
 * { variant: 'bar_magnet';
 *   magnets: Array<{ north: 'left' | 'right';            // 1 or 2 magnets, left to right, on one line
 *                    poles?: 'value' | 'blank' | 'none' }>;   // ('value') "N" / "S" in the two halves; a "?" box in each;
 *                                                        //   or nothing. Both halves are drawn alike, so nothing but
 *                                                        //   the letters (or the arrows) says which end is which.
 *   arrows?: boolean (true);             // arrowheads on the field lines (out of N, into S)
 *   lines?: boolean (true);              // the field lines themselves
 *   compasses?: Array<{ x: number; y: number; label: string;
 *                       needle?: boolean (true) }>;      // ≤ 4; false: an empty compass (its direction is asked).
 *                                                        //   The dark half of a needle is its north-seeking end.
 *   points?: Array<{ x: number; y: number; label: string }>;   // ≤ 3 marked points
 *   title?: string }
 *
 * Coordinates: the origin is the middle of the figure, x to the right, y up.
 * One magnet lies from x = −1.2 to 1.2 (half-height 0.3) in a frame of
 * |x| ≤ 3.4, |y| ≤ 2.3; two lie from ∓3.3 to ∓0.9 in a frame of |x| ≤ 4.6.
 * The field is that of a pole pair per magnet (a point pole 0.2 inside each
 * end) — the lines, every needle and every checker use that one model.
 */
import { FIGURE_WIDTH, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, blank, text, titleBlock } from './draw';
import { SHOWS, facts, head, polyPath, stroke, type Notes, type Pt, type Show } from './draw2';
import { clearLabelSpot, fieldAt, traceFieldLines, visibleRuns } from './field-diagram';

export interface BarMagnet { north: 'left' | 'right'; poles: Show; cx: number }
export interface BarMagnetModel {
  variant: 'bar_magnet';
  magnets: BarMagnet[];
  /** The point poles: q = +1 at a north pole, −1 at a south pole. */
  poles: Array<{ x: number; y: number; q: number }>;
  arrows: boolean;
  lines: boolean;
  compasses: Array<{ x: number; y: number; label: string; needle: boolean }>;
  points: Array<{ x: number; y: number; label: string }>;
  xRange: [number, number];
  yRange: [number, number];
  /** Two magnets: what the facing poles do. */
  interaction?: 'attract' | 'repel';
  title?: string;
}

export const MAGNET_HALF_LENGTH = 1.2;
export const MAGNET_HALF_HEIGHT = 0.3;
const POLE_INSET = 0.2;

export function barMagnetModel(r: Reader): BarMagnetModel {
  const p = r.p;
  const raw = r.list(p.magnets, 'magnets', 1, 2);
  const centres = raw.length === 1 ? [0] : [-2.1, 2.1];
  const magnets = raw.map((v, i): BarMagnet => {
    const o = r.obj(v, `magnets[${i}]`);
    if (o.north !== 'left' && o.north !== 'right') r.fail(`magnets[${i}].north must be one of left, right`);
    const poles = o.poles === undefined || o.poles === null ? 'value' : o.poles;
    if (!SHOWS.includes(poles as Show)) r.fail(`magnets[${i}].poles must be 'value', 'blank' or 'none'`);
    return { north: o.north as 'left' | 'right', poles: poles as Show, cx: centres[i] };
  });
  const poles = magnets.flatMap((mg) => {
    const d = MAGNET_HALF_LENGTH - POLE_INSET;
    const s = mg.north === 'right' ? 1 : -1;
    return [{ x: mg.cx + s * d, y: 0, q: 1 }, { x: mg.cx - s * d, y: 0, q: -1 }];
  });
  const xRange: [number, number] = raw.length === 1 ? [-3.4, 3.4] : [-4.6, 4.6];
  const yRange: [number, number] = [-2.3, 2.3];
  const inMagnet = (x: number, y: number, pad: number): boolean => magnets.some((mg) => Math.abs(x - mg.cx) < MAGNET_HALF_LENGTH + pad && Math.abs(y) < MAGNET_HALF_HEIGHT + pad);
  const spot = (v: unknown, name: string, pad: number, margin: number): { x: number; y: number; label: string } => {
    const o = r.obj(v, name);
    const q = { x: r.num(o.x, `${name}.x`), y: r.num(o.y, `${name}.y`), label: r.str(o.label, `${name}.label`, 4) };
    if (q.x < xRange[0] + margin || q.x > xRange[1] - margin || q.y < yRange[0] + margin || q.y > yRange[1] - margin) r.fail(`${name} is outside the figure (|x| ≤ ${xRange[1] - margin}, |y| ≤ ${yRange[1] - margin})`);
    if (inMagnet(q.x, q.y, pad)) r.fail(`${name} is inside a magnet (or touching it)`);
    return q;
  };
  const compasses = (p.compasses === undefined || p.compasses === null ? [] : r.list(p.compasses, 'compasses', 0, 4)).map((v, i) => ({ ...spot(v, `compasses[${i}]`, 0.32, 0.4), needle: r.bool((v as Record<string, unknown>).needle, `compasses[${i}].needle`, true) }));
  const points = (p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 3)).map((v, i) => spot(v, `points[${i}]`, 0.1, 0.15));
  const m: BarMagnetModel = { variant: 'bar_magnet', magnets, poles, arrows: r.bool(p.arrows, 'arrows', true), lines: r.bool(p.lines, 'lines', true), compasses, points, xRange, yRange, title: r.optStr(p.title, 'title', 160) };
  if (magnets.length === 2) {
    const rightEndOfFirst = magnets[0].north === 'right' ? 'N' : 'S';
    const leftEndOfSecond = magnets[1].north === 'left' ? 'N' : 'S';
    m.interaction = rightEndOfFirst === leftEndOfSecond ? 'repel' : 'attract';
  }
  return m;
}

/** The magnetic field at a point outside the magnets (arbitrary units): out of north poles, into south poles. */
export function magnetFieldAt(m: BarMagnetModel, x: number, y: number): Pt {
  return fieldAt(m.poles, x, y);
}

export function renderBarMagnet(r: Reader): Drawn {
  const m = barMagnetModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const top = t.top + 2;
  const k = (W - 24) / (m.xRange[1] - m.xRange[0]);
  const hgt = (m.yRange[1] - m.yRange[0]) * k;
  const x0 = 12;
  const C = (q: Pt): Pt => [x0 + (q[0] - m.xRange[0]) * k, top + (m.yRange[1] - q[1]) * k];
  const parts: string[] = [`<rect x="${x0}" y="${n2(top)}" width="${W - 24}" height="${n2(hgt)}" fill="none" stroke="#cbd5e1" stroke-width="1"/>`];
  const drawn: Pt[][] = [];
  const bodies = m.magnets.map((mg) => { const a = C([mg.cx - MAGNET_HALF_LENGTH, MAGNET_HALF_HEIGHT]); const b = C([mg.cx + MAGNET_HALF_LENGTH, -MAGNET_HALF_HEIGHT]); return { x0: a[0], y0: a[1], x1: b[0], y1: b[1] }; });
  const inBody = (q: Pt, pad = 0): boolean => bodies.some((b) => q[0] > b.x0 - pad && q[0] < b.x1 + pad && q[1] > b.y0 - pad && q[1] < b.y1 + pad);
  if (m.lines) {
    const model = { variant: 'point_charges' as const, charges: m.poles.map((q) => ({ ...q, showSign: false })), xRange: m.xRange, yRange: m.yRange, linesPerUnit: m.magnets.length === 1 ? 12 : 10, arrows: m.arrows, points: [], equipotentials: [] };
    const d: string[] = [];
    const heads: string[] = [];
    for (const ln of traceFieldLines(model, 0.1)) for (const run of visibleRuns(ln.pts, m.xRange, m.yRange)) {
      const cp = run.map(C);
      // The stretch outside the magnets (a line starts and ends inside one).
      const out = cp.filter((q) => !inBody(q, 0.5));
      if (out.length < 2) continue;
      let len = 0;
      const along = out.map((q, i) => (i === 0 ? 0 : (len += Math.hypot(q[0] - out[i - 1][0], q[1] - out[i - 1][1]))));
      if (len < 14) continue;
      // The whole line is drawn; the magnets, drawn over it, hide the part inside them.
      const kept: Pt[] = [cp[0]];
      for (let i = 1; i < cp.length - 1; i++) if (Math.hypot(cp[i][0] - kept[kept.length - 1][0], cp[i][1] - kept[kept.length - 1][1]) > 3.2) kept.push(cp[i]);
      kept.push(cp[cp.length - 1]);
      drawn.push(out);
      d.push(polyPath(kept));
      if (m.arrows && len > 30) {
        const want = len / 2;
        const i = Math.max(1, along.findIndex((s) => s >= want));
        heads.push(head(out[i][0], out[i][1], out[i][0] - out[i - 1][0], out[i][1] - out[i - 1][1], 7.5, INK));
      }
    }
    parts.push(`<path d="${d.join('')}" ${stroke(INK, 1.25)} stroke-linejoin="round"/>`, ...heads);
  }
  // The magnets, over the lines: two halves drawn alike.
  m.magnets.forEach((mg, i) => {
    const b = bodies[i];
    const mid = (b.x0 + b.x1) / 2;
    parts.push(`<rect x="${n2(b.x0)}" y="${n2(b.y0)}" width="${n2(b.x1 - b.x0)}" height="${n2(b.y1 - b.y0)}" fill="#ffffff" stroke="${INK}" stroke-width="2"/>`, `<path d="M${n2(mid)},${n2(b.y0)}V${n2(b.y1)}" ${stroke(INK, 1.4)}/>`);
    const cy = (b.y0 + b.y1) / 2;
    const halves: Array<[number, string]> = [[(b.x0 + mid) / 2, mg.north === 'left' ? 'N' : 'S'], [(mid + b.x1) / 2, mg.north === 'right' ? 'N' : 'S']];
    for (const [hx, letter] of halves) {
      if (mg.poles === 'value') parts.push(text(hx, cy + 5, letter, { fs: 14, anchor: 'middle', weight: 700 }));
      else if (mg.poles === 'blank') parts.push(blank(hx, cy, 19, 17, 12));
    }
  });
  const obstacles = [...bodies];
  for (const c of m.compasses) {
    const [cx, cy] = C([c.x, c.y]);
    obstacles.push({ x0: cx - 12, y0: cy - 12, x1: cx + 12, y1: cy + 12 });
    parts.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="11" fill="#ffffff" stroke="${INK}" stroke-width="1.5"/>`);
    if (c.needle) {
      const [bx, by] = magnetFieldAt(m, c.x, c.y);
      const l = Math.hypot(bx, by) || 1;
      const [ux, uy] = [bx / l, -by / l];
      const tip: Pt = [cx + ux * 8.6, cy + uy * 8.6];
      const tail: Pt = [cx - ux * 8.6, cy - uy * 8.6];
      const s1: Pt = [cx - uy * 3, cy + ux * 3];
      const s2: Pt = [cx + uy * 3, cy - ux * 3];
      parts.push(`<path d="${polyPath([s1, tip, s2], true)}" fill="${INK}" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`, `<path d="${polyPath([s1, tail, s2], true)}" fill="#ffffff" stroke="${INK}" stroke-width="1" stroke-linejoin="round"/>`);
    } else parts.push(`<circle cx="${n2(cx)}" cy="${n2(cy)}" r="1.6" fill="${INK}"/>`);
  }
  const bounds = { x0: x0 + 1, y0: top + 1, x1: W - 13, y1: top + hgt - 1 };
  const labelled = (px: number, py: number, s: string, italic: boolean, radius: number): void => {
    // Clear of the lines when there is such a place; else where the fewest cross it (the letter has a
    // white keyline, so it still reads) — reported only when it has to sit on more than one line.
    const at = clearLabelSpot(px, py, s, drawn, obstacles.filter((o) => !(px > o.x0 && px < o.x1 && py > o.y0 && py < o.y1)), bounds, px > W / 2, radius);
    if (!at.clear) {
      const box = at.anchor === 'start' ? { x0: at.x - 2, y0: at.y - 12, x1: at.x + 11, y1: at.y + 4 } : { x0: at.x - 11, y0: at.y - 12, x1: at.x + 2, y1: at.y + 4 };
      const n = drawn.filter((ln) => ln.some((q) => q[0] > box.x0 && q[0] < box.x1 && q[1] > box.y0 && q[1] < box.y1)).length;
      if (n > 1) notes.push({ code: 'labels_overlap', message: `the label "${s}" has no place clear of the field lines — move it, or draw it without lines` });
    }
    parts.push(text(at.x, at.y, s, { fs: 13, anchor: at.anchor, weight: 700, italic, halo: true }));
  };
  for (const c of m.compasses) { const [cx, cy] = C([c.x, c.y]); labelled(cx, cy, c.label, false, 11); }
  for (const q of m.points) {
    const [px, py] = C([q.x, q.y]);
    parts.push(`<circle cx="${n2(px)}" cy="${n2(py)}" r="3.4" fill="${INK}" stroke="#ffffff" stroke-width="1.5"/>`);
    labelled(px, py, q.label, true, 0);
  }
  if (m.magnets.every((mg) => mg.poles !== 'value') && !(m.lines && m.arrows) && !m.compasses.some((c) => c.needle)) notes.push({ code: 'ambiguous_blank', message: 'no pole is named, the lines carry no arrowheads and no compass needle is drawn — nothing fixes which end is north' });
  return { body: t.svg + parts.join(''), H: top + hgt + 10, facts: facts(notes) };
}
