/**
 * vector_diagram — vectors as arrows on a numbered grid.
 *
 * { xRange: [min, max]; yRange: [min, max]; xStep?: number; yStep?: number;
 *   xLabel?: string ('x'); yLabel?: string ('y'); title?: string;
 *   vectors: Array<{                       // 1–8
 *     tail?: [x, y] ([0, 0]);
 *     head?: [x, y]  |  components?: [dx, dy]  |  magnitude: number + direction: degrees
 *                                           //   (counter-clockwise from the positive x-axis)
 *     label?: string;                       // printed beside the arrow
 *     showComponents?: boolean (false);     // thin dashes: across, then up
 *     angle?: boolean | { label?: string }; // an arc at the tail from the +x direction round
 *                                           //   (counter-clockwise) to the arrow, on a short
 *                                           //   reference line. label: 'auto' = its size ("37°"),
 *                                           //   any text ("θ"), "?" = a blank box; none by default
 *     dashed?: boolean; color?: '#rrggbb' }>;
 *   tipToTail?: boolean (false);            // each vector starts where the one before ends
 *   resultant?: boolean | { label?: string ('R'; '' for none) };   // default: not drawn
 *   minorGrid?: boolean (false) }           // the lighter lines BETWEEN the numbered gridlines
 *
 * The grid is the plot frame's (equal steps on both axes when none is given),
 * so components are read by counting squares — which is why the lighter
 * half-step lines are NOT drawn unless `minorGrid: true` asks for them: with
 * them a "square" is half a unit, against a stem that says each square is 1.
 * With several vectors each has its own dash pattern as well as its colour
 * (round-capped, so the dot of a dash-dot or dotted pattern is a real dot);
 * the resultant is the heaviest line. Every arrowhead is drawn above every
 * shaft on a thin white keyline; when two arrows end on the same point the
 * later one stops `HEAD_GAP` short of it, so both heads stay whole (the
 * resultant always reaches the point). What an item can hide: any label, the
 * component dashes, the resultant.
 */
import { MUTED, SERIES_COLORS, TICK_FS, assignDashes, buildFrame, estWidth, n2 } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, Placer, arcPath, label, layoutText, numText, segmentBoxes, type Candidate } from './draw';

type Pt = [number, number];

export interface DiagramVector {
  tail: Pt;
  head: Pt;
  label?: string;
  showComponents: boolean;
  dashed: boolean;
  color?: string;
  /** The arc from the +x direction to the arrow: its size (0 < degrees < 360,
   *  counter-clockwise) and what is printed beside it (absent = nothing). */
  angle?: { degrees: number; label?: string };
}

export interface VectorDiagramModel {
  xRange: [number, number];
  yRange: [number, number];
  xStep?: number;
  yStep?: number;
  xLabel: string;
  yLabel: string;
  title?: string;
  vectors: DiagramVector[];
  tipToTail: boolean;
  resultant?: DiagramVector;
  /** Lighter gridlines between the numbered ones (default false). */
  minorGrid?: boolean;
}

/** How far short of a shared end point the second arrow stops (canvas units). */
export const HEAD_GAP = 5;
const HEAD_LEN = 10.5;

const clean = (v: number): number => Number(v.toPrecision(12));

export function vectorDiagramModel(r: Reader): VectorDiagramModel {
  const p = r.p;
  const xRange = r.range(p.xRange, 'xRange');
  const yRange = r.range(p.yRange, 'yRange');
  const tipToTail = r.bool(p.tipToTail, 'tipToTail', false);
  const pair = (v: unknown, name: string): Pt => {
    if (!Array.isArray(v) || v.length !== 2) r.fail(`${name} must be [x, y]`);
    return [r.num((v as unknown[])[0], `${name}[0]`), r.num((v as unknown[])[1], `${name}[1]`)];
  };
  const inside = (q: Pt) => q[0] >= xRange[0] - 1e-9 && q[0] <= xRange[1] + 1e-9 && q[1] >= yRange[0] - 1e-9 && q[1] <= yRange[1] + 1e-9;
  const vectors: DiagramVector[] = [];
  r.list(p.vectors, 'vectors', 1, 8).forEach((raw, i) => {
    const v = r.obj(raw, `vectors[${i}]`);
    const at = `vectors[${i}]`;
    let tail: Pt = v.tail === undefined || v.tail === null ? [0, 0] : pair(v.tail, `${at}.tail`);
    if (tipToTail && i > 0) tail = vectors[i - 1].head;
    let d: Pt;
    if (v.head !== undefined && v.head !== null) {
      const head = pair(v.head, `${at}.head`);
      // Tip-to-tail keeps the vector itself (its components), not where it was first drawn.
      const from: Pt = v.tail === undefined || v.tail === null ? [0, 0] : pair(v.tail, `${at}.tail`);
      d = [head[0] - from[0], head[1] - from[1]];
    } else if (v.components !== undefined && v.components !== null) {
      d = pair(v.components, `${at}.components`);
    } else if (v.magnitude !== undefined && v.direction !== undefined) {
      const mag = r.positive(v.magnitude, `${at}.magnitude`);
      const dir = (r.num(v.direction, `${at}.direction`) * Math.PI) / 180;
      d = [clean(Number((mag * Math.cos(dir)).toFixed(9))), clean(Number((mag * Math.sin(dir)).toFixed(9)))];
    } else {
      return r.fail(`${at} needs head, components, or magnitude and direction`);
    }
    if (Math.hypot(d[0], d[1]) < 1e-9) r.fail(`${at} has zero length`);
    const head: Pt = [clean(tail[0] + d[0]), clean(tail[1] + d[1])];
    if (!inside(tail) || !inside(head)) r.fail(`${at} runs outside xRange / yRange (from (${tail.join(', ')}) to (${head.join(', ')}))`);
    let angle: DiagramVector['angle'];
    if (v.angle !== undefined && v.angle !== null && v.angle !== false) {
      const o = v.angle === true ? {} : r.obj(v.angle, `${at}.angle`);
      const degrees = Number(((((Math.atan2(d[1], d[0]) * 180) / Math.PI) % 360 + 360) % 360).toFixed(6));
      if (degrees < 1e-6) r.fail(`${at}.angle: the vector points along the positive x-direction — there is no angle to mark`);
      const text = r.optStr(o.label, `${at}.angle.label`, 12);
      angle = { degrees, label: text === 'auto' ? `${numText(degrees, 1)}°` : text };
    }
    vectors.push({
      tail, head, angle,
      label: r.optStr(v.label, `${at}.label`, 16),
      showComponents: r.bool(v.showComponents, `${at}.showComponents`, false),
      dashed: r.bool(v.dashed, `${at}.dashed`, false),
      color: r.color(v.color, '') || undefined,
    });
  });
  let resultant: DiagramVector | undefined;
  if (p.resultant !== undefined && p.resultant !== null && p.resultant !== false) {
    const o = p.resultant === true ? {} : r.obj(p.resultant, 'resultant');
    const tail = vectors[0].tail;
    const head: Pt = [clean(tail[0] + vectors.reduce((t, v) => t + v.head[0] - v.tail[0], 0)), clean(tail[1] + vectors.reduce((t, v) => t + v.head[1] - v.tail[1], 0))];
    if (Math.hypot(head[0] - tail[0], head[1] - tail[1]) < 1e-9) r.fail('resultant: the vectors add to zero — there is no arrow to draw');
    if (!inside(head)) r.fail(`resultant: its head (${head.join(', ')}) is outside xRange / yRange`);
    const label = o.label === '' ? undefined : r.optStr(o.label, 'resultant.label', 16) ?? 'R';
    resultant = { tail, head, label, showComponents: r.bool(o.showComponents, 'resultant.showComponents', false), dashed: false };
  }
  return {
    xRange, yRange,
    xStep: r.optStep(p.xStep, 'xStep'), yStep: r.optStep(p.yStep, 'yStep'),
    xLabel: r.optStr(p.xLabel, 'xLabel') ?? 'x', yLabel: r.optStr(p.yLabel, 'yLabel') ?? 'y',
    title: r.optStr(p.title, 'title', 160),
    vectors, tipToTail, resultant,
    minorGrid: r.bool(p.minorGrid, 'minorGrid', false),
  };
}

export function renderVectorDiagram(r: Reader): Drawn {
  const m = vectorDiagramModel(r);
  const spanX = m.xRange[1] - m.xRange[0];
  const spanY = m.yRange[1] - m.yRange[0];
  // Components are read by counting squares: every unit is numbered while that still fits.
  const unit = !m.xStep && !m.yStep && Math.max(spanX, spanY) <= 12 ? 1 : undefined;
  const f = buildFrame({ xRange: m.xRange, yRange: m.yRange, xStep: m.xStep ?? unit, yStep: m.yStep ?? unit, xLabel: m.xLabel, yLabel: m.yLabel, title: m.title, aspect: Math.max(0.6, Math.min(1.25, spanY / spanX)), commonStep: true, minorGrid: m.minorGrid === true });
  const notes: NonNullable<FigureFacts['notes']> = [];
  const placer = new Placer({ x0: f.plot.x + 2, y0: f.plot.y + 2, x1: f.plot.x + f.plot.w - 2, y1: f.plot.y + f.plot.h - 2 });
  const all = m.resultant ? [...m.vectors, m.resultant] : m.vectors;
  const dashes = assignDashes(m.vectors.map((v) => v.dashed));
  const guides: string[] = [];
  const shafts: string[] = [];
  const dots: string[] = [];
  const heads: string[] = [];
  const labels: string[] = [];
  const px = (q: Pt): Pt => [f.X(q[0]), f.Y(q[1])];
  const same = (a: Pt, b: Pt): boolean => Math.hypot(a[0] - b[0], a[1] - b[1]) < 1.5;
  // Where each arrow's head is drawn. The resultant reaches its point; so does the first plain
  // arrow to end there; any other arrow ending on the same point stops HEAD_GAP short of it.
  const tips: Pt[] = all.map((v) => px(v.head));
  const order = m.resultant ? [all.length - 1, ...m.vectors.map((_, i) => i)] : all.map((_, i) => i);
  const claimed: Array<{ at: Pt; dir: number; by: number }> = [];
  for (const i of order) {
    const v = all[i];
    const [x1, y1] = px(v.tail);
    const [x2, y2] = px(v.head);
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const dir = Math.atan2(y2 - y1, x2 - x1);
    const other = claimed.find((c) => same(c.at, [x2, y2]));
    if (other) {
      const gap = Math.min(HEAD_GAP, len * 0.25);
      tips[i] = [x2 - ((x2 - x1) / len) * gap, y2 - ((y2 - y1) / len) * gap];
      const between = Math.abs(((dir - other.dir + 3 * Math.PI) % (2 * Math.PI)) - Math.PI);
      if (between < 0.35) notes.push({ code: 'labels_overlap', message: `two arrows end on the same point from nearly the same direction — their heads cannot be told apart` });
    } else claimed.push({ at: [x2, y2], dir, by: i });
  }
  all.forEach((v) => {
    const [x1, y1] = px(v.tail);
    const [x2, y2] = px(v.head);
    placer.block(...segmentBoxes(x1, y1, x2, y2, 3));
  });
  // A label keeps off the two axes as well (a letter set on the axis line read as struck through).
  if (m.yRange[0] <= 0 && m.yRange[1] >= 0) placer.block(...segmentBoxes(f.plot.x, f.Y(0), f.plot.x + f.plot.w, f.Y(0), 1.5));
  if (m.xRange[0] <= 0 && m.xRange[1] >= 0) placer.block(...segmentBoxes(f.X(0), f.plot.y, f.X(0), f.plot.y + f.plot.h, 1.5));
  const dotted: Pt[] = [];
  /** Tails that already carry an angle arc: a second arc about the same point is drawn larger. */
  const arcsAt: Pt[] = [];
  all.forEach((v, i) => {
    const isR = v === m.resultant;
    const color = isR ? INK : v.color ?? SERIES_COLORS[i % SERIES_COLORS.length];
    const [x1, y1] = px(v.tail);
    const [x2, y2] = tips[i];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const ux = (x2 - x1) / len;
    const uy = (y2 - y1) / len;
    if (v.showComponents) {
      const [hx, hy] = px(v.head);
      const [cx, cy] = px([v.head[0], v.tail[1]]);
      guides.push(`<path d="M${n2(x1)},${n2(y1)}L${n2(cx)},${n2(cy)}L${n2(hx)},${n2(hy)}" fill="none" stroke="${color}" stroke-width="1.3" stroke-dasharray="3 3"/>`);
      placer.block(...segmentBoxes(x1, y1, cx, cy, 2), ...segmentBoxes(cx, cy, hx, hy, 2));
    }
    if (v.angle) {
      // A short reference line along +x from the tail, and the arc from it round to the arrow —
      // measured on the canvas, so it meets the arrow whatever the two scales are.
      const a = (Math.atan2(-(y2 - y1), x2 - x1) + 2 * Math.PI) % (2 * Math.PI);
      const rr = Math.max(13, Math.min(22, len * 0.42)) + 8 * arcsAt.filter((q) => same(q, [x1, y1])).length;
      arcsAt.push([x1, y1]);
      const ref = Math.min(rr + 12, f.plot.x + f.plot.w - x1 - 2);
      if (ref > 6) guides.push(`<path d="M${n2(x1)},${n2(y1)}H${n2(x1 + ref)}" fill="none" stroke="${MUTED}" stroke-width="1.1"/>`);
      guides.push(`<path d="${arcPath(x1, y1, rr, 0, a)}" fill="none" stroke="${INK}" stroke-width="1.2"/>`);
      for (let k = 0; k <= 6; k++) {
        const t = (a * k) / 6;
        placer.block({ x0: x1 + rr * Math.cos(t) - 2, y0: y1 - rr * Math.sin(t) - 2, x1: x1 + rr * Math.cos(t) + 2, y1: y1 - rr * Math.sin(t) + 2 });
      }
      if (v.angle.label) {
        const s = layoutText(v.angle.label);
        const cands: Candidate[] = [];
        for (const out of [rr + 11, rr + 17, rr + 24]) for (const frac of [0.5, 0.35, 0.65, 0.2, 0.8]) {
          const t = a * frac;
          cands.push({ x: x1 + out * Math.cos(t), y: y1 - out * Math.sin(t) + TICK_FS * 0.36, anchor: 'middle' });
        }
        const c = placer.place(s, TICK_FS, cands);
        if (!c.clean) notes.push({ code: 'labels_overlap', message: `there is no clear place for the angle label "${v.angle.label}" beside its arc` });
        labels.push(label(c, v.angle.label, { fs: TICK_FS, weight: 600, halo: true }));
      }
    }
    // One dot per starting point: a second arrow from the same point (or one that starts on the
    // head before it, tip to tail) adds nothing but ink over that head.
    if (!dotted.some((q) => same(q, [x1, y1])) && !all.some((w, j) => j !== i && same(px(w.head), [x1, y1]))) {
      dots.push(`<circle cx="${n2(x1)}" cy="${n2(y1)}" r="2.2" fill="${color}"/>`);
      dotted.push([x1, y1]);
    }
    const w = isR ? 3 : 2.3;
    const dash = isR ? '' : dashes[i];
    const hl = Math.min(len * 0.6, HEAD_LEN);
    const hw = hl * 0.42;
    const bx = x2 - ux * hl;
    const by = y2 - uy * hl;
    // Round caps on a broken pattern: "0.1" is then a dot as wide as the line (with butt caps it
    // is a hairline, and the dotted fourth pattern all but vanished).
    shafts.push(`<path d="M${n2(x1)},${n2(y1)}L${n2(bx + ux * 0.6)},${n2(by + uy * 0.6)}" fill="none" stroke="${color}" stroke-width="${n2(w)}"${dash ? ` stroke-linecap="round" stroke-dasharray="${dash}"` : ''}/>`);
    heads.push(`<polygon points="${n2(x2)},${n2(y2)} ${n2(bx - uy * hw)},${n2(by + ux * hw)} ${n2(bx + uy * hw)},${n2(by - ux * hw)}" fill="${color}" stroke="#ffffff" stroke-width="1" stroke-linejoin="round"/>`);
    if (v.label) {
      const [hx, hy] = px(v.head);
      const nx = -(hy - y1) / len;
      const ny = (hx - x1) / len;
      const cands: Candidate[] = [];
      // Far enough off the shaft for the label's own half-extent across it.
      const need = (Math.abs(nx) * estWidth(layoutText(v.label), TICK_FS + 1)) / 2 + (Math.abs(ny) * (TICK_FS + 1)) / 2 + 5;
      for (const along of [0.5, 0.36, 0.64, 0.24, 0.78]) {
        for (const side of [-1, 1]) {
          for (const gap of [need, need + 5, need + 11]) {
            const bx2 = x1 + (hx - x1) * along + side * nx * gap;
            const by2 = y1 + (hy - y1) * along + side * ny * gap;
            cands.push({ x: bx2, y: by2 + TICK_FS * 0.36, anchor: 'middle' });
          }
        }
      }
      const c = placer.place(layoutText(v.label), TICK_FS + 1, cands);
      if (!c.clean) notes.push({ code: 'labels_overlap', message: `there is no clear place for the label "${v.label}" beside its arrow` });
      labels.push(label(c, v.label, { fs: TICK_FS + 1, weight: 700, fill: color, halo: true }));
    }
  });
  if (m.vectors.length > 6) notes.push({ code: 'too_many_elements', message: `${m.vectors.length} vectors — more than 6 cannot be told apart at 340 px` });
  return {
    body: f.svg + guides.join('') + shafts.join('') + dots.join('') + heads.join('') + labels.join(''),
    H: f.bottom,
    facts: { plot: f.plot, curveCount: 0, marks: [], curves: [], notes },
  };
}
