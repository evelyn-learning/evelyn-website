/**
 * Drawing pieces shared by the batch-1 figure kinds (./*.ts): text, arrows,
 * hatching, the "?" blank, label placement with collision avoidance, and the
 * number formats (fractions, multiples of π, exact unit-circle values).
 *
 * VOCABULARY. A partner page runs every figure through a strict sanitiser
 * and drops a figure it would have to alter, so these helpers emit only what
 * the existing kinds already emit: the elements svg / g / defs / clipPath /
 * rect / line / path / circle / polygon / text, and no attribute beyond
 * those of the pinned client fixture — in particular no opacity (a region is
 * shaded by DRAWN hatch lines under a clip path, never by a translucent or a
 * pattern fill), no `<style>`, no `data-*` / `aria-*`. Arrowheads are plain
 * polygons, so a figure needs no `<marker>`.
 *
 * Pure string building on estimated text widths (plot-frame.ts `estWidth`).
 */
import { INK, MUTED, TICK_FS, TITLE_FS, esc, estWidth, n2, wrapText } from '../plot-frame';

export interface Box {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

export type Anchor = 'start' | 'middle' | 'end';

export interface TextStyle {
  fs?: number;
  anchor?: Anchor;
  weight?: number;
  fill?: string;
  /** A white under-stroke, so the text reads over a line or a hatch. */
  halo?: boolean;
  italic?: boolean;
}

const HALO_ATTRS = ' stroke="#ffffff" stroke-width="3" paint-order="stroke" stroke-linejoin="round"';

export function text(x: number, y: number, s: string, o: TextStyle = {}): string {
  const fs = o.fs ?? TICK_FS;
  return `<text x="${n2(x)}" y="${n2(y)}" font-size="${fs}"${o.weight ? ` font-weight="${o.weight}"` : ''}${o.italic ? ' font-style="italic"' : ''} text-anchor="${o.anchor ?? 'start'}" fill="${o.fill ?? INK}"${o.halo ? HALO_ATTRS : ''}>${esc(s)}</text>`;
}

/** The estimated ink box of a text set at baseline (x, y). */
export function textBox(x: number, y: number, s: string, fs: number = TICK_FS, anchor: Anchor = 'start'): Box {
  const w = estWidth(s, fs);
  const left = anchor === 'middle' ? x - w / 2 : anchor === 'end' ? x - w : x;
  return { x0: left, y0: y - fs * 0.8, x1: left + w, y1: y + fs * 0.24 };
}

export const overlaps = (a: Box, b: Box, pad = 0): boolean => a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;

/** Boxes along a segment, so a label can keep off a line. */
export function segmentBoxes(x1: number, y1: number, x2: number, y2: number, half = 2): Box[] {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const n = Math.max(1, Math.ceil(len / 6));
  const out: Box[] = [];
  for (let i = 0; i <= n; i++) {
    const x = x1 + ((x2 - x1) * i) / n;
    const y = y1 + ((y2 - y1) * i) / n;
    out.push({ x0: x - half, y0: y - half, x1: x + half, y1: y + half });
  }
  return out;
}

export interface Candidate {
  x: number;
  y: number;
  anchor: Anchor;
}

/**
 * Label placement: the first candidate position whose box is inside the
 * bounds and clear of everything placed so far. When none is clear, the one
 * that overlaps least is used and `clean` is false (the legibility report
 * says so — the picture is still drawn).
 */
export class Placer {
  private taken: Box[] = [];
  constructor(private bounds: Box) {}
  block(...boxes: Box[]): void {
    this.taken.push(...boxes);
  }
  /** Take back the last `place` (a caller that tried a position and wants another). */
  unplace(): void {
    this.taken.pop();
  }
  private cost(b: Box): number {
    let c = 0;
    for (const t of this.taken) {
      const dx = Math.min(b.x1, t.x1) - Math.max(b.x0, t.x0);
      const dy = Math.min(b.y1, t.y1) - Math.max(b.y0, t.y0);
      if (dx > 0 && dy > 0) c += dx * dy;
    }
    const out = Math.max(0, this.bounds.x0 - b.x0) + Math.max(0, b.x1 - this.bounds.x1) + Math.max(0, this.bounds.y0 - b.y0) + Math.max(0, b.y1 - this.bounds.y1);
    return c + out * 1000;
  }
  place(s: string, fs: number, candidates: Candidate[]): Candidate & { box: Box; clean: boolean } {
    let best: (Candidate & { box: Box }) | null = null;
    let bestCost = Infinity;
    for (const c of candidates) {
      const box = textBox(c.x, c.y, s, fs, c.anchor);
      const padded = { x0: box.x0 - 1.5, y0: box.y0 - 1, x1: box.x1 + 1.5, y1: box.y1 + 1 };
      const cost = this.cost(padded);
      if (cost === 0) {
        this.taken.push(box);
        return { ...c, box, clean: true };
      }
      if (cost < bestCost) {
        bestCost = cost;
        best = { ...c, box };
      }
    }
    const chosen = best as Candidate & { box: Box };
    this.taken.push(chosen.box);
    return { ...chosen, clean: false };
  }
}

/** Candidate positions for a label of a point at (px, py), going round it
 *  and then outward: preferred direction first (`dirX`, `dirY` — unit vector
 *  pointing away from whatever the label should stay clear of). */
export function around(px: number, py: number, fs: number, dirX = 1, dirY = -1, gaps: number[] = [7, 12, 18]): Candidate[] {
  const out: Candidate[] = [];
  const base = Math.atan2(dirY, dirX);
  for (const gap of gaps) {
    for (const turn of [0, 0.5, -0.5, 1, -1, 1.6, -1.6, 2.4, -2.4, Math.PI]) {
      const a = base + turn;
      const ux = Math.cos(a);
      const uy = Math.sin(a);
      const anchor: Anchor = ux > 0.35 ? 'start' : ux < -0.35 ? 'end' : 'middle';
      // Baseline: below the point the cap height is added; level with it, half of it.
      const y = py + uy * gap + (uy > 0.35 ? fs * 0.8 : uy < -0.35 ? -fs * 0.1 : fs * 0.36);
      out.push({ x: px + ux * gap, y, anchor });
    }
  }
  return out;
}

export interface ArrowStyle {
  color?: string;
  width?: number;
  dash?: string;
  /** Head length (default 3.4 × the stroke width, at least 7). */
  head?: number;
}

/** A straight arrow: the shaft stops inside the head, the head is a filled
 *  triangle with its tip exactly on (x2, y2). */
export function arrow(x1: number, y1: number, x2: number, y2: number, o: ArrowStyle = {}): string {
  const color = o.color ?? INK;
  const w = o.width ?? 2;
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (!(len > 0.01)) return '';
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const hl = Math.min(len * 0.6, o.head ?? Math.max(7, w * 3.4));
  const hw = hl * 0.42;
  const bx = x2 - ux * hl;
  const by = y2 - uy * hl;
  const shaft = `<path d="M${n2(x1)},${n2(y1)}L${n2(bx + ux * 0.6)},${n2(by + uy * 0.6)}" fill="none" stroke="${color}" stroke-width="${n2(w)}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  const head = `<polygon points="${n2(x2)},${n2(y2)} ${n2(bx - uy * hw)},${n2(by + ux * hw)} ${n2(bx + uy * hw)},${n2(by - ux * hw)}" fill="${color}"/>`;
  return shaft + head;
}

/** An arc of radius r about (cx, cy) from angle a0 to a1 (radians, measured
 *  counter-clockwise from +x with y UP — i.e. as on a maths diagram). */
export function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const n = Math.max(2, Math.ceil(Math.abs(a1 - a0) / 0.12));
  const pts: string[] = [];
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push(`${i === 0 ? 'M' : 'L'}${n2(cx + r * Math.cos(a))},${n2(cy - r * Math.sin(a))}`);
  }
  return pts.join('');
}

export type HatchStyle = '/' | '\\' | 'x' | '-' | '|' | '.';
export const HATCH_STYLES: readonly HatchStyle[] = ['/', '\\', '-', 'x', '|'];

/** Path data of parallel lines covering `b`: '/' rises to the right. */
export function hatchPath(b: Box, style: HatchStyle, gap = 6): string {
  const segs: string[] = [];
  const w = b.x1 - b.x0;
  const h = b.y1 - b.y0;
  const diag = (rising: boolean) => {
    // Lines x ± y = c, anchored to the canvas (not the box) so neighbouring regions' hatches line up.
    const step = gap * Math.SQRT2;
    if (rising) {
      const lo = Math.floor((b.x0 + b.y0) / step) * step;
      for (let c = lo; c <= b.x1 + b.y1; c += step) segs.push(`M${n2(c - b.y1)},${n2(b.y1)}L${n2(c - b.y0)},${n2(b.y0)}`);
    } else {
      const lo = Math.floor((b.x0 - b.y1) / step) * step;
      for (let c = lo; c <= b.x1 - b.y0; c += step) segs.push(`M${n2(c + b.y0)},${n2(b.y0)}L${n2(c + b.y1)},${n2(b.y1)}`);
    }
  };
  if (style === '/' || style === 'x') diag(true);
  if (style === '\\' || style === 'x') diag(false);
  if (style === '-') for (let y = Math.ceil(b.y0 / gap) * gap; y <= b.y1; y += gap) segs.push(`M${n2(b.x0)},${n2(y)}h${n2(w)}`);
  if (style === '|') for (let x = Math.ceil(b.x0 / gap) * gap; x <= b.x1; x += gap) segs.push(`M${n2(x)},${n2(b.y0)}v${n2(h)}`);
  return segs.join('');
}

/**
 * A hatched region: `shape` is the markup of the region's outline WITHOUT
 * paint attributes' closing — e.g. `<polygon points="…"` or `<rect x=… ` —
 * it is used once as the clip path and (when `outline` is set) once stroked.
 */
export function hatched(id: string, shapeOpen: string, bbox: Box, style: HatchStyle, color: string, o: { gap?: number; width?: number; outline?: boolean } = {}): { def: string; svg: string } {
  const def = `<clipPath id="${id}">${shapeOpen}/></clipPath>`;
  const lines = `<g clip-path="url(#${id})"><path d="${hatchPath(bbox, style, o.gap ?? 6)}" fill="none" stroke="${color}" stroke-width="${n2(o.width ?? 1)}"/></g>`;
  return { def, svg: lines + (o.outline ? `${shapeOpen} fill="none" stroke="${color}" stroke-width="1"/>` : '') };
}

/** The mark for something left out on purpose: a dashed box with a bold "?". */
export function blank(cx: number, cy: number, w = 20, h = 17, fs = 12): string {
  const x = cx - w / 2;
  const y = cy - h / 2;
  return `<path d="M${n2(x)},${n2(y)}h${n2(w)}v${n2(h)}h${n2(-w)}z" fill="#ffffff" stroke="${MUTED}" stroke-width="1" stroke-dasharray="3 2"/>`
    + text(cx, cy + fs * 0.36, '?', { fs, anchor: 'middle', weight: 700 });
}

/** Width of the ink of a text (narrow glyphs counted narrow) — for a box
 *  drawn ROUND a text. Layout keeps using the wider `estWidth`. */
export function inkWidth(s: string, fs: number): number {
  let w = 0;
  for (const ch of s) w += /[(),.;:'|!ilIjt1 /]/.test(ch) ? 0.3 : /[mwMW—]/.test(ch) ? 0.85 : /[A-Z√π−+=?]/.test(ch) ? 0.62 : 0.54;
  return w * fs;
}

/** What a label is laid out as: a lone "?" is drawn in a dashed box, so it is given the room of one. */
export const layoutText = (s: string): string => (s === '?' ? '???' : s);

/** A placed label. A lone "?" — a name or a value left out on purpose — is
 *  drawn as the dashed blank box, centred in the room `layoutText` reserved. */
export function label(c: { x: number; y: number; anchor: Anchor; box?: Box }, s: string, o: TextStyle = {}): string {
  if (s !== '?') return text(c.x, c.y, s, { ...o, anchor: c.anchor });
  const fs = o.fs ?? TICK_FS;
  const b = c.box ?? textBox(c.x, c.y, layoutText(s), fs, c.anchor);
  return blank((b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2, 19, fs + 5, fs);
}

/** A title drawn inside the figure for the kinds that have no plot frame.
 *  Returns the y at which the figure's own content starts. */
export function titleBlock(title: string | undefined, W: number): { svg: string; top: number } {
  if (!title) return { svg: '', top: 8 };
  const lines = wrapText(title, W - 20, TITLE_FS);
  const svg = lines.map((line, i) => text(W / 2, 10 + TITLE_FS + i * (TITLE_FS + 3), line, { fs: TITLE_FS, anchor: 'middle', weight: 600 })).join('');
  return { svg, top: 10 + lines.length * (TITLE_FS + 3) + 6 };
}

// ---------------------------------------------------------------------------
// Number formats
// ---------------------------------------------------------------------------

const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** num/den in lowest terms: "3", "−1/2", "7/4". */
export function fractionText(num: number, den: number): string {
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(Math.abs(num), den) || 1;
  const n = Math.abs(num) / g;
  const d = den / g;
  return `${num < 0 ? '−' : ''}${n}${d === 1 ? '' : `/${d}`}`;
}

/** num·π/den in lowest terms: "0", "π", "−π/2", "5π/6". */
export function piText(num: number, den: number): string {
  if (num === 0) return '0';
  if (den < 0) {
    num = -num;
    den = -den;
  }
  const g = gcd(Math.abs(num), den) || 1;
  const n = Math.abs(num) / g;
  const d = den / g;
  return `${num < 0 ? '−' : ''}${n === 1 ? '' : n}π${d === 1 ? '' : `/${d}`}`;
}

/** A plain number: up to `dp` decimals, no trailing zeros, a real minus. */
export function numText(v: number, dp = 2): string {
  const r = Number(v.toFixed(dp));
  return String(Object.is(r, -0) ? 0 : r).replace(/^-/, '−');
}

/** cos / sin of a whole number of degrees as an exact expression when the
 *  angle is a multiple of 30° or 45° ("√3/2", "−1/2", "0", "1"), else null. */
export function exactTrig(fn: 'cos' | 'sin', degrees: number): string | null {
  const d = ((Math.round(degrees) % 360) + 360) % 360;
  if (Math.abs(degrees - Math.round(degrees)) > 1e-9 || (d % 30 !== 0 && d % 45 !== 0)) return null;
  const v = fn === 'cos' ? Math.cos((d * Math.PI) / 180) : Math.sin((d * Math.PI) / 180);
  const a = Math.abs(v);
  const mag = a < 1e-9 ? '0' : Math.abs(a - 0.5) < 1e-9 ? '1/2' : Math.abs(a - Math.SQRT1_2) < 1e-9 ? '√2/2' : Math.abs(a - Math.sqrt(3) / 2) < 1e-9 ? '√3/2' : '1';
  return v < -1e-9 ? `−${mag}` : mag;
}

export { INK, MUTED };
