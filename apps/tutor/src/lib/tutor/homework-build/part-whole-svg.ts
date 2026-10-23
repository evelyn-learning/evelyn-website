/**
 * Static SVG thumbnails of the part-whole homework figures: fraction bars
 * (showFractionBar), tape diagrams (showDiagram tape_diagram) and area models
 * (showDiagram area_model), for the homework list (spec 2026-10-21 §4.6
 * option (b)). The board draws these with FractionBarRenderer,
 * TapeDiagramRenderer and AreaModelRenderer, which are not rendered here
 * (hooks / shared live code, GAC freeze); these small hand-written writers
 * mirror their layout and what they print: a fraction item's label or its
 * n/d; a tape part's label, "?" on an unknown part, the bar's name and total;
 * an area model's side lengths and, per cell, its label, else the product
 * when showProducts is not false (the gate passes that only when every
 * product is stated), else r×c. No comparison lines. Bounded: a figure
 * beyond the gate's limits has no thumbnail. Never throws: anything it
 * cannot draw gives null.
 */

import { DIAGRAM_COLORS as C } from '../diagrams/theme';
import { AREA_MAX_SPLITS, TAPE_MAX_BARS, TAPE_MAX_SEGMENTS } from './figure-validate-diagram';
import { FRACTION_MAX_DENOMINATOR, FRACTION_MAX_ITEMS } from './figure-validate-data';
import { clip, esc, fmt, isNum, num, svgDoc } from './svg-util';
import type { DiagramFigure, FigureCommand } from './types';

type FractionBar = Extract<FigureCommand, { action: 'showFractionBar' }>;
type Obj = Record<string, unknown>;

const obj = (v: unknown): Obj | null => (v && typeof v === 'object' && !Array.isArray(v) ? v as Obj : null);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');
const isCount = (v: unknown): v is number => typeof v === 'number' && Number.isInteger(v);

// FractionBarRenderer's sizes and colours.
const BAR_W = 160, BAR_H = 32, R = 48, CELL = 28, GAP = 40, PAD = 24, LABEL_DY = 22;
const SHADE = '#2563eb', EMPTY = '#f1f5f9', EDGE = '#cbd5e1', LABEL = '#334155';

function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export function fractionBarToSvg(fig: FractionBar): string | null {
  try {
    const f = fig as unknown as Obj;
    const items = f.items;
    if (!Array.isArray(items) || items.length === 0 || items.length > FRACTION_MAX_ITEMS) return null;
    const parsed = items.map((raw) => {
      const it = obj(raw);
      if (!it || !isCount(it.denominator) || !isCount(it.numerator)) return null;
      const d = it.denominator, n = it.numerator;
      if (d <= 0 || d > FRACTION_MAX_DENOMINATOR || n < 0) return null;
      const style = it.style === 'circle' || it.style === 'grid' ? it.style : 'bar';
      const cols = Math.ceil(Math.sqrt(d)), rows = Math.ceil(d / cols);
      const size = style === 'bar' ? { w: BAR_W, h: BAR_H } : style === 'circle' ? { w: 2 * R, h: 2 * R } : { w: cols * CELL, h: rows * CELL };
      return { d, n: Math.min(n, d), style, cols, label: str(it.label) || `${n}/${d}`, ...size };
    });
    if (parsed.some((p) => !p)) return null;
    const ps = parsed as NonNullable<(typeof parsed)[number]>[];
    const vertical = f.layout === 'vertical';
    const title = str(f.title);
    const top = PAD + (title ? 26 : 0);
    const boxW = (p: (typeof ps)[number]) => Math.max(p.w, Math.min(240, clip(p.label, 34).length * 13 * 0.55));
    const out: string[] = [];
    let x = PAD, y = top, W = 0, H = 0;
    ps.forEach((p, i) => {
      const bw = boxW(p);
      const sx = x + (bw - p.w) / 2, sy = y;
      const parts: string[] = [];
      for (let k = 0; k < p.d; k++) {
        const fill = k < p.n ? SHADE : EMPTY;
        const shaded = k < p.n ? 1 : 0;
        if (p.style === 'bar') {
          const pw = BAR_W / p.d;
          parts.push(`<rect data-part="${k}" data-shaded="${shaded}" x="${fmt(sx + k * pw)}" y="${fmt(sy)}" width="${fmt(pw)}" height="${BAR_H}" fill="${fill}" stroke="${EDGE}" stroke-width="1"></rect>`);
        } else if (p.style === 'circle') {
          const cx = sx + R, cy = sy + R;
          if (p.d === 1) { parts.push(`<circle data-part="0" data-shaded="${shaded}" cx="${fmt(cx)}" cy="${fmt(cy)}" r="${R}" fill="${fill}" stroke="${EDGE}" stroke-width="1"></circle>`); continue; }
          const a0 = (360 / p.d) * k, a1 = a0 + 360 / p.d;
          const [x0, y0] = polar(cx, cy, R, a0), [x1, y1] = polar(cx, cy, R, a1);
          parts.push(`<path data-part="${k}" data-shaded="${shaded}" d="M ${fmt(cx)} ${fmt(cy)} L ${fmt(x0)} ${fmt(y0)} A ${R} ${R} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${fmt(x1)} ${fmt(y1)} Z" fill="${fill}" stroke="${EDGE}" stroke-width="1"></path>`);
        } else {
          const cx = sx + (k % p.cols) * CELL, cy = sy + Math.floor(k / p.cols) * CELL;
          parts.push(`<rect data-part="${k}" data-shaded="${shaded}" x="${fmt(cx)}" y="${fmt(cy)}" width="${CELL}" height="${CELL}" fill="${fill}" stroke="${EDGE}" stroke-width="1"></rect>`);
        }
      }
      out.push(`<g data-item="${i}">${parts.join('')}<text x="${fmt(x + bw / 2)}" y="${fmt(sy + p.h + LABEL_DY)}" text-anchor="middle" font-size="13" font-weight="500" fill="${LABEL}">${esc(clip(p.label, 34))}</text></g>`);
      W = Math.max(W, x + bw); H = Math.max(H, y + p.h + LABEL_DY + 6);
      if (vertical) y += p.h + LABEL_DY + GAP; else x += bw + GAP;
    });
    W += PAD; H += PAD;
    if (title) out.unshift(`<text x="${fmt(W / 2)}" y="${PAD + 4}" text-anchor="middle" font-size="14" font-weight="600" fill="${C.text}">${esc(clip(title, 50))}</text>`);
    return svgDoc(W, H, out);
  } catch {
    return null;
  }
}

// TapeDiagramRenderer's palette and rows.
const TAPE_PALETTE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];
const TAPE_W = 600, NAME_W = 90, TAPE_BAR_H = 44, ROW_H = 90;

export function tapeToSvg(fig: DiagramFigure): string | null {
  try {
    const p = obj((fig as unknown as Obj).params);
    const bars = p?.bars;
    if (!p || !Array.isArray(bars) || bars.length === 0 || bars.length > TAPE_MAX_BARS) return null;
    const parsed = bars.map((raw) => {
      const b = obj(raw);
      const segs = b?.segments;
      if (!b || !Array.isArray(segs) || segs.length === 0 || segs.length > TAPE_MAX_SEGMENTS) return null;
      const ss = segs.map((s) => { const o = obj(s); return o && isNum(o.length) && o.length > 0 ? { length: o.length, label: str(o.label), unknown: o.unknown === true, color: typeof o.color === 'string' && /^#[0-9a-f]{3,8}$/i.test(o.color) ? o.color : '' } : null; });
      if (ss.some((s) => !s)) return null;
      return { name: str(b.name), total: str(b.totalLabel), segs: ss as Array<{ length: number; label: string; unknown: boolean; color: string }> };
    });
    if (parsed.some((b) => !b)) return null;
    const bs = parsed as NonNullable<(typeof parsed)[number]>[];
    const hasNames = bs.some((b) => b.name);
    const x0 = hasNames ? NAME_W + 10 : 10;
    const usable = TAPE_W - x0 - 10;
    const totals = bs.map((b) => b.segs.reduce((s, g) => s + g.length, 0));
    const shared = p.sharedScale !== false;
    const maxTotal = Math.max(...totals);
    const title = str(p.title);
    const top = title ? 34 : 10;
    const out: string[] = [];
    if (title) out.push(`<text x="${TAPE_W / 2}" y="22" text-anchor="middle" font-size="15" font-weight="600" fill="${C.text}">${esc(clip(title, 60))}</text>`);
    bs.forEach((b, bi) => {
      const yTop = top + bi * ROW_H;
      const pxPer = (shared ? usable / maxTotal : usable / totals[bi]);
      if (b.name) out.push(`<text x="${NAME_W}" y="${fmt(yTop + TAPE_BAR_H / 2 + 5)}" text-anchor="end" font-size="14" font-weight="600" fill="${C.text}">${esc(clip(b.name, 12))}</text>`);
      let x = x0;
      b.segs.forEach((s, si) => {
        const w = s.length * pxPer;
        const col = TAPE_PALETTE[si % TAPE_PALETTE.length];
        const fill = s.unknown ? '#fde68a' : s.color || `${col}33`;
        const stroke = s.unknown ? '#d97706' : s.color || col;
        const label = s.unknown && !s.label ? '?' : s.label;
        out.push(`<g data-segment="${si}"><rect x="${fmt(x)}" y="${fmt(yTop)}" width="${fmt(w)}" height="${TAPE_BAR_H}" fill="${fill}" stroke="${stroke}" stroke-width="2"></rect>`
          + (label ? `<text x="${fmt(x + w / 2)}" y="${fmt(yTop + TAPE_BAR_H / 2 + 5)}" text-anchor="middle" font-size="14" font-weight="600" fill="${C.text}">${esc(clip(label, 14))}</text>` : '')
          + '</g>');
        x += w;
      });
      if (b.total) {
        const bw = x - x0;
        out.push(`<path d="M ${fmt(x0)} ${fmt(yTop + TAPE_BAR_H + 6)} L ${fmt(x0)} ${fmt(yTop + TAPE_BAR_H + 12)} L ${fmt(x0 + bw)} ${fmt(yTop + TAPE_BAR_H + 12)} L ${fmt(x0 + bw)} ${fmt(yTop + TAPE_BAR_H + 6)}" fill="none" stroke="#6b7280" stroke-width="1.5"></path>`
          + `<text x="${fmt(x0 + bw / 2)}" y="${fmt(yTop + TAPE_BAR_H + 28)}" text-anchor="middle" font-size="13" font-weight="600" fill="${C.text}">${esc(clip(b.total, 30))}</text>`);
      }
    });
    return svgDoc(TAPE_W, top + bs.length * ROW_H, out);
  } catch {
    return null;
  }
}

// AreaModelRenderer's layout and colours.
const AREA_FILL = ['#dbeafe', '#dcfce7', '#fef3c7', '#fee2e2', '#ede9fe', '#fce7f3'];
const AREA_STROKE = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const AREA_W = 600, AREA_PAD = 60;

export function areaModelToSvg(fig: DiagramFigure): string | null {
  try {
    const p = obj((fig as unknown as Obj).params);
    if (!p) return null;
    const side = (v: unknown) => (Array.isArray(v) && v.length > 0 && v.length <= AREA_MAX_SPLITS && v.every((x) => isNum(x) && x > 0) ? v as number[] : null);
    const rows = side(p.rows), cols = side(p.cols);
    if (!rows || !cols) return null;
    const cl = Array.isArray(p.cellLabels) ? p.cellLabels as unknown[] : null;
    const showProducts = p.showProducts !== false;
    const totalH = rows.reduce((s, v) => s + v, 0), totalW = cols.reduce((s, v) => s + v, 0);
    // The board's height follows the true aspect ratio; the thumbnail clamps it so a thin strip stays visible.
    const usableW = AREA_W - AREA_PAD - 16;
    const usableH = Math.min(Math.max(usableW * (totalH / totalW), 80), 900);
    const title = str(p.title);
    const top = (title ? 26 : 0) + 32;
    const out: string[] = [];
    if (title) out.push(`<text x="${AREA_W / 2}" y="20" text-anchor="middle" font-size="15" font-weight="600" fill="${C.text}">${esc(clip(title, 60))}</text>`);
    let xc = AREA_PAD;
    cols.forEach((c) => {
      const w = (c / totalW) * usableW;
      out.push(`<text x="${fmt(xc + w / 2)}" y="${top - 12}" text-anchor="middle" font-size="14" font-weight="600" fill="#374151">${esc(num(c))}</text>`);
      xc += w;
    });
    let yc = top;
    rows.forEach((r, i) => {
      const h = (r / totalH) * usableH;
      out.push(`<text x="${AREA_PAD - 10}" y="${fmt(yc + h / 2 + 5)}" text-anchor="end" font-size="14" font-weight="600" fill="#374151">${esc(num(r))}</text>`);
      let x = AREA_PAD;
      cols.forEach((c, j) => {
        const w = (c / totalW) * usableW;
        const k = (i * cols.length + j) % AREA_FILL.length;
        const row = cl && Array.isArray(cl[i]) ? cl[i] as unknown[] : null;
        const override = row && row[j] !== undefined && row[j] !== null ? String(row[j]) : null;
        const text = override ?? (showProducts ? num(r * c) : `${num(r)}×${num(c)}`);
        out.push(`<g data-cell="${i}-${j}"><rect x="${fmt(x)}" y="${fmt(yc)}" width="${fmt(w)}" height="${fmt(h)}" fill="${AREA_FILL[k]}" stroke="${AREA_STROKE[k]}" stroke-width="1.5"></rect>`
          + (text ? `<text x="${fmt(x + w / 2)}" y="${fmt(yc + h / 2 + 5)}" text-anchor="middle" font-size="14" font-weight="600" fill="#1f2937">${esc(clip(text, 12))}</text>` : '')
          + '</g>');
        x += w;
      });
      yc += h;
    });
    return svgDoc(AREA_W, yc + 10, out);
  } catch {
    return null;
  }
}
