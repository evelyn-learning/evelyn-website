/**
 * flow_diagram — boxes and labelled arrows for chains, cycles and webs, and
 * a stacked pyramid.
 *
 * variant 'chain' — a process or reaction chain, laid out in reading order
 *   (it turns back at the right-hand edge when it does not fit in one row):
 *   { nodes: Node[];                     // 2–8
 *     steps?: Array<Step | null> }       // steps[i] labels the arrow from node i to node i + 1
 * variant 'cycle' — the same, with a last arrow back to the first box
 *   (a feedback loop, a nutrient cycle), laid out round a ring, clockwise:
 *   { nodes: Node[];                     // 2–6
 *     steps?: Array<Step | null> }       // one per node; steps[n − 1] is the arrow back to node 0
 * variant 'web' — boxes placed on a grid, arrows wherever the spec says
 *   (a food web: an arrow points from what is eaten to what eats it):
 *   { nodes: Array<Node & { col: number; row: number }>;   // 2–9; col 0–3, row 0–4 (row 0 is the TOP row)
 *     edges: Array<{ from: id; to: id } & Step> }
 * variant 'pyramid' — stacked bars, widest at the bottom (trophic levels):
 *   { levels: Array<{ label: string; blank?: boolean;      // 2–6, from the BOTTOM up
 *                     value?: number; show?: 'value' | 'blank' | 'none' ('value') }>;
 *     unit?: string;                     // after each value ("kJ")
 *     transferPercent?: number }         // what passes to the next level (used by the checker; never printed)
 * Node = { id: string; label: string; blank?: boolean }     // blank: a dashed "?" box (the label is the answer)
 * Step = string | { label?: string; blank?: boolean; sign?: '+' | '−' | '-' }
 *                                        // a sign is drawn in a small circle on the arrow (feedback)
 * Common: title?: string.
 */
import { FIGURE_WIDTH, TICK_FS, estWidth, n2, wrapText } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, blank, text, titleBlock } from './draw';
import { SHOWS, facts, head, lab, numStr, stroke, type Notes, type Pt, type Show } from './draw2';

export interface FlowNode { id: string; label: string; blank: boolean; col: number; row: number }
export interface FlowEdge { from: string; to: string; label?: string; blank: boolean; sign?: '+' | '−' }
export interface FlowLevel { label: string; blank: boolean; value?: number; show: Show }
export interface FlowModel {
  variant: 'chain' | 'cycle' | 'web' | 'pyramid';
  nodes: FlowNode[];
  edges: FlowEdge[];
  levels: FlowLevel[];
  unit: string;
  transferPercent?: number;
  title?: string;
}

const VARIANTS = ['chain', 'cycle', 'web', 'pyramid'] as const;
const RING: Record<number, Array<[number, number]>> = {
  2: [[0, 0], [1, 0]],
  3: [[1, 0], [2, 1], [0, 1]],
  4: [[0, 0], [1, 0], [1, 1], [0, 1]],
  5: [[0, 0], [1, 0], [2, 0], [1.5, 1], [0.5, 1]],
  6: [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [0, 1]],
};

export function flowModel(r: Reader): FlowModel {
  const p = r.p;
  if (!VARIANTS.includes(p.variant as FlowModel['variant'])) r.fail(`variant must be one of ${VARIANTS.join(', ')}`);
  const variant = p.variant as FlowModel['variant'];
  const title = r.optStr(p.title, 'title', 160);
  const unit = r.optStr(p.unit, 'unit', 8) ?? '';
  if (variant === 'pyramid') {
    const levels = r.list(p.levels, 'levels', 2, 6).map((raw, i): FlowLevel => {
      const o = r.obj(raw, `levels[${i}]`);
      const value = r.optNum(o.value, `levels[${i}].value`);
      if (value !== undefined && !(value > 0)) r.fail(`levels[${i}].value must be greater than 0`);
      if (o.show !== undefined && o.show !== null && !SHOWS.includes(o.show as Show)) r.fail(`levels[${i}].show must be 'value', 'blank' or 'none'`);
      const show = value === undefined ? 'none' : ((o.show as Show) ?? 'value');
      return { label: r.str(o.label, `levels[${i}].label`, 30), blank: r.bool(o.blank, `levels[${i}].blank`, false), value, show };
    });
    const tp = r.optNum(p.transferPercent, 'transferPercent');
    if (tp !== undefined && !(tp > 0 && tp <= 100)) r.fail('transferPercent must be between 0 and 100');
    return { variant, nodes: [], edges: [], levels, unit, transferPercent: tp, title };
  }
  const step = (raw: unknown, name: string): Omit<FlowEdge, 'from' | 'to'> => {
    if (raw === null || raw === undefined) return { blank: false };
    if (typeof raw === 'string') return { label: r.str(raw, name, 22), blank: false };
    const o = r.obj(raw, name);
    if (o.sign !== undefined && o.sign !== null && !['+', '−', '-'].includes(o.sign as string)) r.fail(`${name}.sign must be '+' or '−'`);
    const b = r.bool(o.blank, `${name}.blank`, false);
    const label = r.optStr(o.label, `${name}.label`, 22);
    if (b && !label && !o.sign) r.fail(`${name}: a blank arrow needs the label (or sign) that belongs there — it is the answer`);
    return { label, blank: b, sign: o.sign === undefined || o.sign === null ? undefined : o.sign === '+' ? '+' : '−' };
  };
  const max = variant === 'web' ? 9 : variant === 'cycle' ? 6 : 8;
  const nodes = r.list(p.nodes, 'nodes', 2, max).map((raw, i): FlowNode => {
    const o = r.obj(raw, `nodes[${i}]`);
    const node = { id: r.str(o.id, `nodes[${i}].id`, 24), label: r.str(o.label, `nodes[${i}].label`, 36), blank: r.bool(o.blank, `nodes[${i}].blank`, false), col: 0, row: 0 };
    if (variant === 'web') {
      node.col = r.num(o.col, `nodes[${i}].col`);
      node.row = r.num(o.row, `nodes[${i}].row`);
      if (!Number.isInteger(node.col) || node.col < 0 || node.col > 3 || !Number.isInteger(node.row) || node.row < 0 || node.row > 4) r.fail(`nodes[${i}]: col must be 0–3 and row 0–4`);
    }
    return node;
  });
  nodes.forEach((n, i) => {
    if (nodes.findIndex((x) => x.id === n.id) !== i) r.fail(`nodes: the id "${n.id}" is used twice`);
    if (variant === 'web' && nodes.findIndex((x) => x.col === n.col && x.row === n.row) !== i) r.fail(`nodes: two boxes at col ${n.col}, row ${n.row}`);
  });
  let edges: FlowEdge[];
  if (variant === 'web') {
    edges = r.list(p.edges, 'edges', 1, 16).map((raw, i) => {
      const o = r.obj(raw, `edges[${i}]`);
      const from = r.str(o.from, `edges[${i}].from`, 24);
      const to = r.str(o.to, `edges[${i}].to`, 24);
      for (const id of [from, to]) if (!nodes.some((n) => n.id === id)) r.fail(`edges[${i}]: "${id}" is not a node`);
      if (from === to) r.fail(`edges[${i}]: an arrow from a box to itself`);
      return { from, to, ...step(o, `edges[${i}]`) };
    });
    edges.forEach((e, i) => { if (edges.findIndex((x) => x.from === e.from && x.to === e.to) !== i) r.fail(`edges: the arrow ${e.from} → ${e.to} is given twice`); });
  } else {
    const count = variant === 'cycle' ? nodes.length : nodes.length - 1;
    const steps = p.steps === undefined || p.steps === null ? [] : r.list(p.steps, 'steps', 0, count);
    edges = Array.from({ length: count }, (_, i) => ({ from: nodes[i].id, to: nodes[(i + 1) % nodes.length].id, ...step(steps[i], `steps[${i}]`) }));
  }
  return { variant, nodes, edges, levels: [], unit, title };
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

const FS = 12;
const LINE = 14;

function renderPyramid(m: FlowModel, W: number, t: { svg: string; top: number }): Drawn {
  const notes: Notes = [];
  const parts: string[] = [];
  const n = m.levels.length;
  const valueText = (l: FlowLevel): string => (l.show === 'none' || l.value === undefined ? '' : l.show === 'blank' ? '?' : `${numStr(l.value, 3).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}${m.unit ? ` ${m.unit}` : ''}`);
  const valueW = Math.max(0, ...m.levels.map((l) => estWidth(valueText(l) === '?' ? '???' : valueText(l), FS))) + (m.levels.some((l) => valueText(l)) ? 12 : 0);
  const wMax = W - 24 - valueW;
  const wMin = Math.min(wMax, Math.max(86, wMax * 0.3));
  const cx = 12 + wMax / 2;
  const barH = 34;
  const y0 = t.top + 4;
  m.levels.forEach((l, i) => {
    const w = n === 1 ? wMax : wMax - ((wMax - wMin) * i) / (n - 1);
    const y = y0 + (n - 1 - i) * barH;
    parts.push(`<rect x="${n2(cx - w / 2)}" y="${n2(y)}" width="${n2(w)}" height="${barH}" fill="${i % 2 === 0 ? '#eef2f7' : '#ffffff'}" stroke="${INK}" stroke-width="1.5"/>`);
    if (l.blank) parts.push(blank(cx, y + barH / 2, 26, 20, 13));
    else {
      const lines = wrapText(l.label, w - 10, FS);
      if (lines.length > 2 || lines.some((s) => estWidth(s, FS) > w - 4)) notes.push({ code: 'crowded', message: `levels[${i}].label does not fit its bar — shorten it` });
      lines.slice(0, 2).forEach((s, k) => parts.push(text(cx, y + barH / 2 + FS * 0.36 + (k - (Math.min(lines.length, 2) - 1) / 2) * LINE, s, { fs: FS, anchor: 'middle', weight: 600 })));
    }
    const v = valueText(l);
    if (v) parts.push(lab(cx + wMax / 2 + 10, y + barH / 2 + FS * 0.36, v, 'start', { fs: FS }));
  });
  if (m.levels.every((l) => l.show !== 'value') && m.levels.some((l) => l.show === 'blank')) notes.push({ code: 'ambiguous_blank', message: 'levels: a value is asked for and none is given — nothing fixes it' });
  return { body: t.svg + parts.join(''), H: y0 + n * barH + 10, facts: facts(notes) };
}

export function renderFlowDiagram(r: Reader): Drawn {
  const m = flowModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  if (m.variant === 'pyramid') return renderPyramid(m, W, t);
  const notes: Notes = [];
  const n = m.nodes.length;
  const edgeText = (e: FlowEdge): string => (e.blank ? '?' : e.label ?? '');
  const labelW = Math.max(0, ...m.edges.map((e) => (edgeText(e) ? estWidth(edgeText(e) === '?' ? '???' : edgeText(e), TICK_FS) + 10 : 0)), m.edges.some((e) => e.sign) ? 52 : 0);
  // Grid positions.
  let cols: number;
  if (m.variant === 'web') cols = Math.max(...m.nodes.map((x) => x.col)) + 1;
  else if (m.variant === 'cycle') {
    RING[n].forEach(([c, rw], i) => { m.nodes[i].col = c; m.nodes[i].row = rw; });
    cols = Math.max(...RING[n].map(([c]) => c)) + 1;
  } else {
    // The most columns (up to four) whose boxes and arrow labels still fit.
    cols = Math.min(n, 4);
    const fits = (c: number) => c * 70 + (c - 1) * Math.max(30, labelW) <= W - 20;
    while (cols > 1 && !fits(cols)) cols--;
    m.nodes.forEach((x, i) => {
      x.row = Math.floor(i / cols);
      x.col = x.row % 2 === 0 ? i % cols : cols - 1 - (i % cols);
    });
  }
  const rows = Math.max(...m.nodes.map((x) => x.row)) + 1;
  const gapX = cols > 1 ? Math.max(m.variant === 'chain' ? 30 : 36, m.variant === 'web' ? 26 : labelW) : 0;
  const boxW = Math.min(118, (W - 20 - (cols - 1) * gapX) / cols);
  const wrapped = m.nodes.map((x) => (x.blank ? ['?'] : wrapText(x.label, boxW - 10, FS)));
  wrapped.forEach((lines, i) => {
    if (lines.length > 3 || lines.some((s) => estWidth(s, FS) > boxW - 2)) notes.push({ code: 'crowded', message: `nodes[${i}].label does not fit its box (${Math.floor(boxW)} units wide) — shorten it` });
  });
  const boxH = Math.max(30, Math.min(3, Math.max(...wrapped.map((l) => l.length))) * LINE + 12);
  const hasEdgeText = m.edges.some((e) => edgeText(e) || e.sign);
  const gapY = m.variant === 'web' ? 44 : hasEdgeText ? 46 : 34;
  const pitchX = boxW + gapX;
  const totalW = cols * boxW + (cols - 1) * gapX;
  const x0 = (W - totalW) / 2;
  const y0 = t.top + 6;
  const centre = (x: FlowNode): Pt => [x0 + x.col * pitchX + boxW / 2, y0 + x.row * (boxH + gapY) + boxH / 2];
  const byId = new Map(m.nodes.map((x) => [x.id, x]));
  const parts: string[] = [];
  const labels: string[] = [];
  /** Where the segment from the centre of a box towards q leaves the box (with a small gap). */
  const leave = (c: Pt, q: Pt, pad: number): Pt => {
    const dx = q[0] - c[0];
    const dy = q[1] - c[1];
    const tx = dx === 0 ? Infinity : (boxW / 2 + pad) / Math.abs(dx);
    const ty = dy === 0 ? Infinity : (boxH / 2 + pad) / Math.abs(dy);
    const k = Math.min(tx, ty);
    return [c[0] + dx * k, c[1] + dy * k];
  };
  m.edges.forEach((e, i) => {
    const a = centre(byId.get(e.from) as FlowNode);
    const b = centre(byId.get(e.to) as FlowNode);
    // An arrow each way between two boxes: each is moved to its own side.
    const twin = m.edges.some((x) => x.from === e.to && x.to === e.from);
    const L = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const nx = -(b[1] - a[1]) / L;
    const ny = (b[0] - a[0]) / L;
    const off = twin ? 7 : 0;
    const a2: Pt = [a[0] + nx * off, a[1] + ny * off];
    const b2: Pt = [b[0] + nx * off, b[1] + ny * off];
    const s = leave(a2, b2, 3);
    const f = leave(b2, a2, 4);
    const len = Math.hypot(f[0] - s[0], f[1] - s[1]);
    if (len < 16) notes.push({ code: 'crowded', message: `the arrow ${e.from} → ${e.to} is under 16 units long` });
    parts.push(`<path d="M${n2(s[0])},${n2(s[1])}L${n2(f[0] - ((f[0] - s[0]) / len) * 6)},${n2(f[1] - ((f[1] - s[1]) / len) * 6)}" ${stroke(INK, 1.7)}/>` + head(f[0], f[1], f[0] - s[0], f[1] - s[1], 9));
    const mx = (s[0] + f[0]) / 2;
    const my = (s[1] + f[1]) / 2;
    const horizontal = Math.abs(f[1] - s[1]) < 1;
    const label = edgeText(e);
    // The label: over a level arrow, beside any other; a twin's on its own outer side.
    let side = twin ? 1 : horizontal ? (ny > 0 ? -1 : 1) : nx >= 0 ? 1 : -1;
    if (!twin && !horizontal && m.variant === 'web' && i % 2 === 1) side = -side;
    if (e.sign && !e.blank) {
      const sx = label ? mx - ((f[0] - s[0]) / len) * 0 : mx;
      labels.push(`<circle cx="${n2(sx)}" cy="${n2(my)}" r="8.5" fill="#ffffff" stroke="${INK}" stroke-width="1.3"/>` + text(sx, my + 4.6, e.sign, { fs: 13, anchor: 'middle', weight: 700 }));
    }
    if (label) {
      const d = e.sign && !e.blank ? 14 : horizontal ? 7 : 6;
      if (horizontal) labels.push(lab(mx, my + (side * ny > 0 ? d + 9 : -d), label, 'middle', { halo: true }));
      else if (Math.abs(f[0] - s[0]) < 1) {
        // Beside an upright arrow: on its right, or on its left when the right would leave the figure.
        const fits = mx + d + 1 + estWidth(label === '?' ? '???' : label, TICK_FS) <= W - 4;
        labels.push(lab(fits ? mx + d + 1 : mx - d - 1, my + 4, label, fits ? 'start' : 'end', { halo: true }));
      }
      else labels.push(lab(mx + nx * side * d + (nx * side > 0 ? 2 : -2), my + ny * side * d + 4, label, nx * side > 0 ? 'start' : 'end', { halo: true }));
    } else if (e.blank) labels.push(lab(mx, my + 4, '?', 'middle'));
  });
  m.nodes.forEach((x, i) => {
    const [cx, cy] = centre(x);
    if (x.blank) {
      parts.push(`<rect x="${n2(cx - boxW / 2)}" y="${n2(cy - boxH / 2)}" width="${n2(boxW)}" height="${n2(boxH)}" rx="5" fill="#ffffff" stroke="${MUTED}" stroke-width="1.3" stroke-dasharray="4 3"/>` + text(cx, cy + 5, '?', { fs: 14, anchor: 'middle', weight: 700 }));
      return;
    }
    parts.push(`<rect x="${n2(cx - boxW / 2)}" y="${n2(cy - boxH / 2)}" width="${n2(boxW)}" height="${n2(boxH)}" rx="5" fill="#ffffff" stroke="${INK}" stroke-width="1.5"/>`);
    const lines = wrapped[i].slice(0, 3);
    lines.forEach((s, k) => parts.push(text(cx, cy + FS * 0.36 + (k - (lines.length - 1) / 2) * LINE, s, { fs: FS, anchor: 'middle', weight: 600 })));
  });
  if (m.edges.length > 14) notes.push({ code: 'too_many_elements', message: `${m.edges.length} arrows — more than 14 cannot be followed at 340 px` });
  return { body: t.svg + parts.join('') + labels.join(''), H: y0 + rows * boxH + (rows - 1) * gapY + 10, facts: facts(notes) };
}
