/**
 * schematic_map — a schematic region map on a square grid. Regions are plain
 * polygons given by their corners (no real coastline is drawn or implied).
 *
 * { grid: { cols: number; rows: number };        // 4–16 across, 3–12 up; x runs east, y runs NORTH, in squares
 *   scale: { squares: number; length: number; unit?: string ('km');   // the bar spans `squares` squares = `length` units
 *            show?: 'value' | 'blank' | 'none' };                     // ('value') 'blank': the length is a "?" box
 *   regions: Array<{ points: Array<[x, y]>;      // 3–10 corners; ≤ 8 regions
 *                    label?: string | '?' | null;      // printed on the region ("?" = a blank box)
 *                    name?: string;                    // what a checker calls it when the label is hidden
 *                    value?: number }>;                // shown by HATCH density, never by colour (see legend)
 *   legend?: { title: string; unit?: string };   // the key to the hatches: one swatch per distinct value (≤ 4)
 *   markers?: Array<{ x: number; y: number; label: string | '?' }>;   // ≤ 8 dots with a letter or name
 *   arrows?: Array<{ from: [x, y]; to: [x, y]; label?: string; dashed?: boolean }>;   // ≤ 4 (migration, gene flow, a current)
 *   north?: boolean (true);                      // the north arrow
 *   showGrid?: boolean (true);                   // the grid lines (one square = scale.length ÷ scale.squares)
 *   title?: string }
 *
 * Distances are read by counting squares against the scale bar; directions
 * against the north arrow (north is always up).
 */
import { FIGURE_WIDTH, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, Placer, around, arrow, hatched, layoutText, segmentBoxes, text, titleBlock, type HatchStyle } from './draw';
import { SHOWS, facts, lab, numStr, polyPath, stroke, type Notes, type Pt, type Show } from './draw2';

export interface MapRegion { points: Pt[]; label: string | null; name: string; value?: number }
export interface MapModel {
  cols: number;
  rows: number;
  scale: { squares: number; length: number; unit: string; show: Show };
  /** Real-world length of one grid square. */
  unitsPerSquare: number;
  regions: MapRegion[];
  /** The distinct region values, ascending — class k is drawn with hatch k. */
  classes: number[];
  legend?: { title: string; unit?: string };
  markers: Array<{ x: number; y: number; label: string }>;
  arrows: Array<{ from: Pt; to: Pt; label?: string; dashed: boolean }>;
  north: boolean;
  showGrid: boolean;
  title?: string;
}

/** Hatch of class k (0 = the lowest value: none): denser, then crossed. */
const HATCHES: Array<{ style: HatchStyle; gap: number } | null> = [null, { style: '/', gap: 9 }, { style: '/', gap: 4.5 }, { style: 'x', gap: 4.5 }];

export function mapModel(r: Reader): MapModel {
  const p = r.p;
  const g = r.obj(p.grid, 'grid');
  const whole = (v: unknown, name: string, lo: number, hi: number): number => {
    const k = r.num(v, name);
    if (!Number.isInteger(k) || k < lo || k > hi) r.fail(`${name} must be a whole number from ${lo} to ${hi}`);
    return k;
  };
  const cols = whole(g.cols, 'grid.cols', 4, 16);
  const rows = whole(g.rows, 'grid.rows', 3, 12);
  const sc = r.obj(p.scale, 'scale');
  const squares = r.positive(sc.squares, 'scale.squares');
  if (squares > cols) r.fail('scale.squares is wider than the grid');
  const show = sc.show === undefined || sc.show === null ? 'value' : sc.show;
  if (!SHOWS.includes(show as Show)) r.fail("scale.show must be 'value', 'blank' or 'none'");
  const length = r.positive(sc.length, 'scale.length');
  const pt = (v: unknown, name: string): Pt => {
    if (!Array.isArray(v) || v.length !== 2) r.fail(`${name} must be [x, y]`);
    const q: Pt = [r.num((v as unknown[])[0], `${name}[0]`), r.num((v as unknown[])[1], `${name}[1]`)];
    if (q[0] < 0 || q[0] > cols || q[1] < 0 || q[1] > rows) r.fail(`${name} is outside the grid (0–${cols} across, 0–${rows} up)`);
    return q;
  };
  const used = new Set<string>();
  const unique = (s: string, where: string): string => {
    if (s !== '?' && used.has(s)) r.fail(`${where}: the label "${s}" is used twice`);
    used.add(s);
    return s;
  };
  const regions = r.list(p.regions, 'regions', 0, 8).map((raw, i): MapRegion => {
    const o = r.obj(raw, `regions[${i}]`);
    const points = r.list(o.points, `regions[${i}].points`, 3, 10).map((v, k) => pt(v, `regions[${i}].points[${k}]`));
    const label = o.label === null || o.label === undefined ? null : unique(r.str(o.label, `regions[${i}].label`, 16), 'regions');
    const name = r.optStr(o.name, `regions[${i}].name`, 16) ?? (label && label !== '?' ? label : `region ${i + 1}`);
    return { points, label, name, value: r.optNum(o.value, `regions[${i}].value`) };
  });
  const classes = [...new Set(regions.filter((x) => x.value !== undefined).map((x) => x.value as number))].sort((a, b) => a - b);
  if (classes.length > 4) r.fail(`regions: ${classes.length} different values — at most 4 hatch classes can be told apart at 340 px (group the values)`);
  let legend: MapModel['legend'];
  if (p.legend !== undefined && p.legend !== null) {
    const o = r.obj(p.legend, 'legend');
    legend = { title: r.str(o.title, 'legend.title', 30), unit: r.optStr(o.unit, 'legend.unit', 12) };
  }
  if (classes.length > 0 && !legend) r.fail('legend: regions carry values — give legend.title, so the hatches have a key');
  const markers = (p.markers === undefined || p.markers === null ? [] : r.list(p.markers, 'markers', 0, 8)).map((raw, i) => {
    const o = r.obj(raw, `markers[${i}]`);
    const q = pt([o.x, o.y], `markers[${i}]`);
    return { x: q[0], y: q[1], label: unique(r.str(o.label, `markers[${i}].label`, 12), 'markers') };
  });
  const arrows = (p.arrows === undefined || p.arrows === null ? [] : r.list(p.arrows, 'arrows', 0, 4)).map((raw, i) => {
    const o = r.obj(raw, `arrows[${i}]`);
    const from = pt(o.from, `arrows[${i}].from`);
    const to = pt(o.to, `arrows[${i}].to`);
    if (Math.hypot(to[0] - from[0], to[1] - from[1]) < 0.5) r.fail(`arrows[${i}]: shorter than half a square`);
    return { from, to, label: r.optStr(o.label, `arrows[${i}].label`, 16), dashed: r.bool(o.dashed, `arrows[${i}].dashed`, false) };
  });
  return {
    cols, rows, scale: { squares, length, unit: r.optStr(sc.unit, 'scale.unit', 6) ?? 'km', show: show as Show }, unitsPerSquare: length / squares,
    regions, classes, legend, markers, arrows, north: r.bool(p.north, 'north', true), showGrid: r.bool(p.showGrid, 'showGrid', true), title: r.optStr(p.title, 'title', 160),
  };
}

export function renderSchematicMap(r: Reader, uid: string): Drawn {
  const m = mapModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const s = Math.min((W - 24) / m.cols, 236 / m.rows);
  const mw = m.cols * s;
  const mh = m.rows * s;
  const x0 = (W - mw) / 2;
  const top = t.top + 2;
  const C = (q: Pt): Pt => [x0 + q[0] * s, top + (m.rows - q[1]) * s];
  const defs: string[] = [];
  const parts: string[] = [`<rect x="${n2(x0)}" y="${n2(top)}" width="${n2(mw)}" height="${n2(mh)}" fill="#ffffff" stroke="#94a3b8" stroke-width="1"/>`];
  const placer = new Placer({ x0: x0 + 1, y0: top + 1, x1: x0 + mw - 1, y1: top + mh - 1 });
  // Land: a light fill, then its hatch.
  m.regions.forEach((reg, i) => {
    const P = reg.points.map(C);
    const shape = `<path d="${polyPath(P, true)}"`;
    parts.push(`${shape} fill="#eef2f6"/>`);
    const h = reg.value === undefined ? null : HATCHES[m.classes.indexOf(reg.value)];
    if (h) {
      const xs = P.map((q) => q[0]);
      const ys = P.map((q) => q[1]);
      const hd = hatched(`${uid}-r${i}`, shape, { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) }, h.style, '#64748b', { gap: h.gap, width: 1 });
      defs.push(hd.def);
      parts.push(hd.svg);
    }
  });
  if (m.showGrid) {
    const d: string[] = [];
    for (let i = 1; i < m.cols; i++) d.push(`M${n2(x0 + i * s)},${n2(top)}V${n2(top + mh)}`);
    for (let j = 1; j < m.rows; j++) d.push(`M${n2(x0)},${n2(top + j * s)}H${n2(x0 + mw)}`);
    parts.push(`<path d="${d.join('')}" ${stroke('#b6c2d1', 0.7)}/>`);
  }
  m.regions.forEach((reg) => {
    const P = reg.points.map(C);
    parts.push(`<path d="${polyPath(P, true)}" ${stroke(INK, 1.6)} stroke-linejoin="round"/>`);
  });
  const labels: string[] = [];
  // Arrows, then markers; their labels are placed clear of both.
  m.arrows.forEach((a) => {
    const [p0, p1] = [C(a.from), C(a.to)];
    parts.push(arrow(p0[0], p0[1], p1[0], p1[1], { color: INK, width: 2.2, dash: a.dashed ? '6 4' : undefined, head: 9 }));
    placer.block(...segmentBoxes(p0[0], p0[1], p1[0], p1[1], 3));
  });
  m.markers.forEach((mk) => {
    const [px, py] = C([mk.x, mk.y]);
    parts.push(`<circle cx="${n2(px)}" cy="${n2(py)}" r="3.8" fill="${INK}" stroke="#ffffff" stroke-width="1.5"/>`);
    placer.block({ x0: px - 5, y0: py - 5, x1: px + 5, y1: py + 5 });
  });
  m.markers.forEach((mk) => {
    const [px, py] = C([mk.x, mk.y]);
    const at = placer.place(layoutText(mk.label), 12, around(px, py, 12, 1, -1, [8, 12, 17]));
    if (!at.clean) notes.push({ code: 'labels_overlap', message: `the label "${mk.label}" of a marker could not be set clear of the map's other marks` });
    labels.push(lab(at.x, at.y, mk.label, at.anchor, { fs: 12, weight: 700, halo: true }));
  });
  m.arrows.forEach((a) => {
    if (!a.label) return;
    const [p0, p1] = [C(a.from), C(a.to)];
    const [mx, my] = [(p0[0] + p1[0]) / 2, (p0[1] + p1[1]) / 2];
    const at = placer.place(a.label, TICK_FS, around(mx, my, TICK_FS, 0, -1, [8, 12, 17]));
    labels.push(text(at.x, at.y, a.label, { anchor: at.anchor, italic: true, halo: true }));
  });
  // Region names: at the centroid when that is clear, else beside it.
  m.regions.forEach((reg, i) => {
    if (!reg.label) return;
    const P = reg.points.map(C);
    const cx = P.reduce((a, q) => a + q[0], 0) / P.length;
    const cy = P.reduce((a, q) => a + q[1], 0) / P.length;
    const fs = TICK_FS;
    const cands = [{ x: cx, y: cy + fs * 0.36, anchor: 'middle' as const }, { x: cx, y: cy - 8, anchor: 'middle' as const }, { x: cx, y: cy + 16, anchor: 'middle' as const }, ...around(cx, cy, fs, 0, -1, [14, 22, 30])];
    const at = placer.place(layoutText(reg.label), fs, cands);
    if (!at.clean) notes.push({ code: 'labels_overlap', message: `regions[${i}]: the label "${reg.label}" could not be set clear of the markers and arrows` });
    labels.push(lab(at.x, at.y, reg.label, at.anchor, { fs, weight: 600, italic: true, halo: true }));
  });
  parts.push(...labels);
  // Under the map: the scale bar on the left, the north arrow on the right.
  let y = top + mh + 8;
  if (m.scale.show !== 'none' || m.north) {
    if (m.scale.show !== 'none') {
      const bw = m.scale.squares * s;
      const by = y + 7;
      parts.push(`<path d="M${n2(x0)},${n2(by)}H${n2(x0 + bw)}M${n2(x0)},${n2(by - 5)}v10M${n2(x0 + bw)},${n2(by - 5)}v10" ${stroke(INK, 1.8)}/>`);
      parts.push(text(x0, by + 18, '0', { anchor: 'middle' }), lab(x0 + bw, by + 18, m.scale.show === 'blank' ? '?' : `${numStr(m.scale.length, 2)} ${m.scale.unit}`, m.scale.show === 'blank' ? 'middle' : 'middle', {}));
    }
    if (m.north) {
      const nx = x0 + mw - 10;
      parts.push(arrow(nx, y + 30, nx, y + 10, { color: INK, width: 2, head: 9 }), text(nx - 12, y + 24, 'N', { fs: 12, anchor: 'middle', weight: 700 }));
    }
    y += 34;
  }
  if (m.legend && m.classes.length > 0) {
    parts.push(text(x0, y + TICK_FS + 2, m.legend.title, { weight: 600 }));
    y += TICK_FS + 8;
    let x = x0;
    m.classes.forEach((v, k) => {
      const label = `${numStr(v, 2)}${m.legend?.unit ? ` ${m.legend.unit}` : ''}`;
      const w = 24 + 5 + estWidth(label, TICK_FS) + 14;
      if (x > x0 && x + w > W - 8) { x = x0; y += 20; }
      const shape = `<rect x="${n2(x)}" y="${n2(y)}" width="24" height="14"`;
      parts.push(`${shape} fill="#eef2f6"/>`);
      const h = HATCHES[k];
      if (h) {
        const hd = hatched(`${uid}-k${k}`, shape, { x0: x, y0: y, x1: x + 24, y1: y + 14 }, h.style, '#64748b', { gap: h.gap, width: 1 });
        defs.push(hd.def);
        parts.push(hd.svg);
      }
      parts.push(`${shape} fill="none" stroke="${INK}" stroke-width="1"/>`, text(x + 29, y + 11, label, {}));
      x += w;
    });
    y += 20;
  }
  if (s < 18) notes.push({ code: 'crowded', message: `the grid squares are drawn ${Math.floor(s)} units wide — under 18, squares cannot be counted at 340 px (fewer cols or rows)` });
  return { body: (defs.length ? `<defs>${defs.join('')}</defs>` : '') + t.svg + parts.join(''), H: y + 4, facts: facts(notes) };
}
