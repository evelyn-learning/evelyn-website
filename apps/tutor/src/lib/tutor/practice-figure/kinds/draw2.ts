/**
 * Drawing pieces shared by the batch-2 figure kinds (circuit, phylogenetic
 * tree, geometric figure, ray diagram, field diagram, flow diagram, solid,
 * spectrum). Same vocabulary rule as ./draw.ts: only the elements and
 * attributes of the pinned client fixture — an ellipse is a `<path>` of two
 * arcs, a polyline is a `<path>`, an arrowhead is a `<polygon>`.
 */
import { TICK_FS, n2 } from '../plot-frame';
import type { FigureFacts } from '../spec';
import { INK, MUTED, blank, text, textBox, type Anchor, type Box, type TextStyle } from './draw';

export type Notes = NonNullable<FigureFacts['notes']>;
export type Pt = [number, number];

export const facts = (notes: Notes): FigureFacts => ({ curveCount: 0, marks: [], curves: [], notes });

/** Stroke attributes of an outline. */
export const stroke = (color: string = INK, width = 1.6, dash?: string): string => `fill="none" stroke="${color}" stroke-width="${n2(width)}"${dash ? ` stroke-dasharray="${dash}"` : ''}`;

/** `M x,y L x,y …` through the points (closed with `z` when asked). */
export function polyPath(pts: ReadonlyArray<Pt>, close = false): string {
  return pts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${n2(x)},${n2(y)}`).join('') + (close ? 'z' : '');
}

export const seg = (x1: number, y1: number, x2: number, y2: number, color: string = INK, width = 1.6, dash?: string): string =>
  `<path d="M${n2(x1)},${n2(y1)}L${n2(x2)},${n2(y2)}" ${stroke(color, width, dash)}/>`;

/** Path data of a whole ellipse (two arcs). */
export const ellipseD = (cx: number, cy: number, rx: number, ry: number): string =>
  `M${n2(cx - rx)},${n2(cy)}A${n2(rx)},${n2(ry)} 0 0 1 ${n2(cx + rx)},${n2(cy)}A${n2(rx)},${n2(ry)} 0 0 1 ${n2(cx - rx)},${n2(cy)}z`;

/** Path data of half an ellipse: the upper (`upper`) or the lower half, left to right. */
export const halfEllipseD = (cx: number, cy: number, rx: number, ry: number, upper: boolean): string =>
  `M${n2(cx - rx)},${n2(cy)}A${n2(rx)},${n2(ry)} 0 0 ${upper ? 1 : 0} ${n2(cx + rx)},${n2(cy)}`;

/** A filled arrowhead with its tip at (x, y), pointing along (ux, uy). */
export function head(x: number, y: number, ux: number, uy: number, size = 8, color: string = INK): string {
  const l = Math.hypot(ux, uy) || 1;
  const dx = ux / l;
  const dy = uy / l;
  const bx = x - dx * size;
  const by = y - dy * size;
  const hw = size * 0.42;
  return `<polygon points="${n2(x)},${n2(y)} ${n2(bx - dy * hw)},${n2(by + dx * hw)} ${n2(bx + dy * hw)},${n2(by - dx * hw)}" fill="${color}"/>`;
}

/** A label that is a lone "?" is drawn as the dashed blank box; anything else as text. */
export function lab(x: number, y: number, s: string, anchor: Anchor = 'middle', o: TextStyle = {}): string {
  const fs = o.fs ?? TICK_FS;
  if (s !== '?') return text(x, y, s, { ...o, fs, anchor });
  const cx = anchor === 'middle' ? x : anchor === 'start' ? x + 10 : x - 10;
  return blank(cx, y - fs * 0.36, 19, fs + 5, fs);
}

/** The box a `lab` takes (a blank is given the room of its dashed box). */
export function labBox(x: number, y: number, s: string, anchor: Anchor = 'middle', fs: number = TICK_FS): Box {
  if (s !== '?') return textBox(x, y, s, fs, anchor);
  const cx = anchor === 'middle' ? x : anchor === 'start' ? x + 10 : x - 10;
  return { x0: cx - 10, y0: y - fs * 0.36 - (fs + 5) / 2, x1: cx + 10, y1: y - fs * 0.36 + (fs + 5) / 2 };
}

/** A horizontal dimension line from x1 to x2 at y, end ticks, the label centred on a white gap. */
export function hDim(x1: number, x2: number, y: number, s: string, color: string = MUTED): string {
  const mid = (x1 + x2) / 2;
  const tick = (x: number) => `M${n2(x)},${n2(y - 4)}v8`;
  return `<path d="M${n2(x1)},${n2(y)}H${n2(x2)}${tick(x1)}${tick(x2)}" ${stroke(color, 1)}/>`
    + lab(mid, y + TICK_FS * 0.36, s, 'middle', { halo: true, fill: INK });
}

/** What a hideable value prints: the value, "?" (asked for), or nothing. */
export type Show = 'value' | 'blank' | 'none';
export const SHOWS: readonly Show[] = ['value', 'blank', 'none'];

/** A number as printed on a figure: up to `dp` decimals, a real minus. */
export function numStr(v: number, dp = 2): string {
  const r = Number(v.toFixed(dp));
  return String(Object.is(r, -0) ? 0 : r).replace(/^-/, '−');
}

export const deg = (d: number): number => (d * Math.PI) / 180;
