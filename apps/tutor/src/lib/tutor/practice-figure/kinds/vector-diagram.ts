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
 *     dashed?: boolean; color?: '#rrggbb' }>;
 *   tipToTail?: boolean (false);            // each vector starts where the one before ends
 *   resultant?: boolean | { label?: string ('R'; '' for none) } }   // default: not drawn
 *
 * The grid is the plot frame's (equal steps on both axes when none is given),
 * so components are read by counting squares. With several vectors each has
 * its own dash pattern as well as its colour; the resultant is the heaviest
 * line. What an item can hide: any label, the component dashes, the resultant.
 */
import { SERIES_COLORS, TICK_FS, assignDashes, buildFrame, estWidth, n2 } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, Placer, arrow, label, layoutText, segmentBoxes, type Candidate } from './draw';

type Pt = [number, number];

export interface DiagramVector {
  tail: Pt;
  head: Pt;
  label?: string;
  showComponents: boolean;
  dashed: boolean;
  color?: string;
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
}

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
    vectors.push({
      tail, head,
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
  };
}

export function renderVectorDiagram(r: Reader): Drawn {
  const m = vectorDiagramModel(r);
  const spanX = m.xRange[1] - m.xRange[0];
  const spanY = m.yRange[1] - m.yRange[0];
  // Components are read by counting squares: every unit is numbered while that still fits.
  const unit = !m.xStep && !m.yStep && Math.max(spanX, spanY) <= 12 ? 1 : undefined;
  const f = buildFrame({ xRange: m.xRange, yRange: m.yRange, xStep: m.xStep ?? unit, yStep: m.yStep ?? unit, xLabel: m.xLabel, yLabel: m.yLabel, title: m.title, aspect: Math.max(0.6, Math.min(1.25, spanY / spanX)), commonStep: true });
  const notes: NonNullable<FigureFacts['notes']> = [];
  const placer = new Placer({ x0: f.plot.x + 2, y0: f.plot.y + 2, x1: f.plot.x + f.plot.w - 2, y1: f.plot.y + f.plot.h - 2 });
  const all = m.resultant ? [...m.vectors, m.resultant] : m.vectors;
  const dashes = assignDashes(m.vectors.map((v) => v.dashed));
  const guides: string[] = [];
  const arrows: string[] = [];
  const labels: string[] = [];
  const px = (q: Pt): Pt => [f.X(q[0]), f.Y(q[1])];
  all.forEach((v) => {
    const [x1, y1] = px(v.tail);
    const [x2, y2] = px(v.head);
    placer.block(...segmentBoxes(x1, y1, x2, y2, 3));
  });
  all.forEach((v, i) => {
    const isR = v === m.resultant;
    const color = isR ? INK : v.color ?? SERIES_COLORS[i % SERIES_COLORS.length];
    const [x1, y1] = px(v.tail);
    const [x2, y2] = px(v.head);
    if (v.showComponents) {
      const [cx, cy] = px([v.head[0], v.tail[1]]);
      guides.push(`<path d="M${n2(x1)},${n2(y1)}L${n2(cx)},${n2(cy)}L${n2(x2)},${n2(y2)}" fill="none" stroke="${color}" stroke-width="1.3" stroke-dasharray="3 3"/>`);
      placer.block(...segmentBoxes(x1, y1, cx, cy, 2), ...segmentBoxes(cx, cy, x2, y2, 2));
    }
    arrows.push(`<circle cx="${n2(x1)}" cy="${n2(y1)}" r="2.2" fill="${color}"/>`);
    arrows.push(arrow(x1, y1, x2, y2, { color, width: isR ? 3 : 2.3, dash: isR ? undefined : dashes[i] || undefined, head: 10 }));
    if (v.label) {
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const nx = -(y2 - y1) / len;
      const ny = (x2 - x1) / len;
      const cands: Candidate[] = [];
      // Far enough off the shaft for the label's own half-extent across it.
      const need = (Math.abs(nx) * estWidth(layoutText(v.label), TICK_FS + 1)) / 2 + (Math.abs(ny) * (TICK_FS + 1)) / 2 + 5;
      for (const along of [0.5, 0.36, 0.64, 0.24, 0.78]) {
        for (const side of [-1, 1]) {
          for (const gap of [need, need + 5, need + 11]) {
            const bx = x1 + (x2 - x1) * along + side * nx * gap;
            const by = y1 + (y2 - y1) * along + side * ny * gap;
            cands.push({ x: bx, y: by + TICK_FS * 0.36, anchor: 'middle' });
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
    body: f.svg + guides.join('') + arrows.join('') + labels.join(''),
    H: f.bottom,
    facts: { plot: f.plot, curveCount: 0, marks: [], curves: [], notes },
  };
}
