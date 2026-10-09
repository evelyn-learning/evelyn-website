/**
 * Plot frame for practice figures — the axes, grid, tick numbers and labels
 * every axis-based figure kind is drawn on (render.ts), as plain SVG text.
 *
 * Sized for a PHONE first. The board renderers lay out on a 520–640 unit
 * canvas with 10–12 unit type; shown 340 px wide that type is 6–7 px. Here
 * the canvas is `FIGURE_WIDTH` (360) units wide with 11–13 unit type, so at
 * 340 px the smallest text is ≈ 10 px, and the figure scales up cleanly
 * (viewBox only — no pixel width or height anywhere).
 *
 * Everything a student must READ a value from gets a numbered grid with
 * round steps (1 / 2 / 5 × 10ⁿ) and a minor grid between the numbers.
 *
 * Pure string building: no React, no DOM, no measurement — text widths are
 * estimated with the same average-glyph heuristic the board renderers use
 * (0.55–0.6 × font size per character). Deterministic.
 */

export const FIGURE_WIDTH = 360;
/** Fonts that exist without the app's CSS; set once on the root element. */
export const FIGURE_FONT = "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export const INK = '#111827';
export const MUTED = '#4b5563';
const GRID_MAJOR = '#cbd5e1';
const GRID_MINOR = '#e9eef4';
const FRAME = '#94a3b8';

/** Series colours: blue / vermilion / bluish green / raspberry / plum /
 *  tan. Each is at least 4.5 : 1 on white, and every pair stays apart
 *  (CIELAB ΔE ≥ 16) under simulated deuteranopia, protanopia and tritanopia —
 *  the old green / purple pair collapsed onto vermilion / blue there. Colour
 *  is never the only cue: see `SERIES_DASHES` and the legend. */
export const SERIES_COLORS = ['#1d4ed8', '#c2410c', '#0f766e', '#9d174d', '#772288', '#996644'] as const;

/** Stroke patterns for the 1st, 2nd, … curve of a figure that has MORE THAN
 *  ONE (a lone curve is solid): solid, dashed, dash-dot, dotted, long-dash,
 *  dash-dot-dot. Written for a ≈ 2.2-unit stroke with ROUND caps — a cap adds
 *  half the stroke width to each end, so "0.1" is a round dot and every gap
 *  here still shows ≈ 2.5 units of white at 340 px. None of them is the thin
 *  grey long-dash an asymptote is drawn with (`GUIDE_DASH`). */
export const SERIES_DASHES = ['', '6 5', '9 5 0.1 5', '0.1 4.6', '14 5', '9 5 0.1 5 0.1 5'] as const;
/** Asymptotes and other guide lines: thin, grey, long-dashed, butt caps. */
export const GUIDE_COLOR = '#6b7280';
export const GUIDE_DASH = '10 4';
export const GUIDE_WIDTH = 1;

/** One stroke pattern per curve. A lone curve is solid ("7 4" when the spec
 *  says `dashed`). With several, the curves the spec marks `dashed` take the
 *  broken patterns first, in order; the rest take what is left starting with
 *  solid — so "A solid, B dashed" in a question stays true. */
export function assignDashes(dashedFlags: boolean[]): string[] {
  if (dashedFlags.length <= 1) return dashedFlags.map((d) => (d ? '7 4' : ''));
  const n = SERIES_DASHES.length;
  const out: string[] = new Array(dashedFlags.length).fill('');
  const free = SERIES_DASHES.map((_, i) => i);
  dashedFlags.forEach((d, i) => {
    if (!d) return;
    const k = free.findIndex((j) => j > 0);
    out[i] = SERIES_DASHES[k >= 0 ? free.splice(k, 1)[0] : 1 + (i % (n - 1))];
  });
  dashedFlags.forEach((d, i) => {
    if (d) return;
    out[i] = SERIES_DASHES[free.length > 0 ? (free.shift() as number) : i % n];
  });
  return out;
}

/** ` stroke-dasharray="…"`, or nothing for a solid line. */
export function dashAttr(dash: string | undefined): string {
  return dash ? ` stroke-dasharray="${dash}"` : '';
}

/** Marker shapes for the 1st, 2nd, … point series of a scatter plot. */
export const SERIES_SHAPES = ['circle', 'square', 'triangle', 'diamond', 'triangle-down', 'ring'] as const;
export type SeriesShape = (typeof SERIES_SHAPES)[number];

/** A data marker centred on (cx, cy) with a thin white ring, so it reads on
 *  a gridline or an axis. `r` is the circle's radius; the other shapes are
 *  sized to the same visual weight. */
export function shapeMark(shape: SeriesShape, cx: number, cy: number, r: number, color: string): string {
  const ring = 'stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round"';
  switch (shape) {
    case 'square': { const h = r * 0.9; return `<path d="M${n2(cx - h)},${n2(cy - h)}h${n2(2 * h)}v${n2(2 * h)}h${n2(-2 * h)}z" fill="${color}" ${ring}/>`; }
    case 'triangle': { const h = r * 1.25; return `<path d="M${n2(cx)},${n2(cy - h)}L${n2(cx + h)},${n2(cy + h * 0.8)}L${n2(cx - h)},${n2(cy + h * 0.8)}z" fill="${color}" ${ring}/>`; }
    case 'triangle-down': { const h = r * 1.25; return `<path d="M${n2(cx)},${n2(cy + h)}L${n2(cx + h)},${n2(cy - h * 0.8)}L${n2(cx - h)},${n2(cy - h * 0.8)}z" fill="${color}" ${ring}/>`; }
    case 'diamond': { const h = r * 1.3; return `<path d="M${n2(cx)},${n2(cy - h)}L${n2(cx + h)},${n2(cy)}L${n2(cx)},${n2(cy + h)}L${n2(cx - h)},${n2(cy)}z" fill="${color}" ${ring}/>`; }
    case 'ring': return `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r + 1.4)}" fill="#ffffff"/><circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r - 0.4)}" fill="#ffffff" stroke="${color}" stroke-width="1.8"/>`;
    default: return `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="${n2(r)}" fill="${color}" stroke="#ffffff" stroke-width="1.2"/>`;
  }
}

export const TICK_FS = 11;
export const LABEL_FS = 12;
export const TITLE_FS = 13;
const GLYPH = 0.58;

export function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/** A coordinate: at most 2 decimals, no trailing zeros, never "-0". */
export function n2(v: number): string {
  const r = Math.round(v * 100) / 100;
  return Object.is(r, -0) ? '0' : String(r);
}

export function estWidth(text: string, fontSize: number): number {
  return text.length * fontSize * GLYPH;
}

/** Greedy word wrap on the estimated width. A single word longer than the
 *  budget stays on its own line (the caller sizes for it). */
export function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];
  const lines: string[] = [];
  let line = words[0];
  for (const w of words.slice(1)) {
    if (estWidth(`${line} ${w}`, fontSize) <= maxWidth) line = `${line} ${w}`;
    else {
      lines.push(line);
      line = w;
    }
  }
  lines.push(line);
  return lines;
}

/** The round step (1 / 2 / 5 × 10ⁿ) that gives at most `maxTicks` intervals over `span`. */
export function niceStep(span: number, maxTicks: number): number {
  if (!(span > 0) || !(maxTicks > 0)) return 1;
  const raw = span / maxTicks;
  const pow = Math.pow(10, Math.floor(Math.log10(raw)));
  for (const m of [1, 2, 5, 10]) {
    if (m * pow >= raw * (1 - 1e-9)) return m * pow;
  }
  return 10 * pow;
}

/** Multiples of `step` inside [min, max], free of float dust. */
export function ticksBetween(min: number, max: number, step: number): number[] {
  const out: number[] = [];
  if (!(step > 0)) return out;
  const eps = step * 1e-6;
  const first = Math.ceil((min - eps) / step);
  const last = Math.floor((max + eps) / step);
  // A guard, not a layout rule: a caller's own tiny step cannot emit thousands of lines.
  if (last - first > 400) return out;
  for (let k = first; k <= last; k++) out.push(Number((k * step).toPrecision(12)));
  return out;
}

/** How many minor intervals sit inside one major step: 1→2, 2→2, 5→5. */
function minorDivisions(step: number): number {
  const mant = step / Math.pow(10, Math.floor(Math.log10(step) + 1e-9));
  return Math.abs(mant - 5) < 1e-6 ? 5 : 2;
}

/** Decimal places needed to write `step` exactly (0.25 → 2, 5 → 0), up to 6. */
export function stepDecimals(step: number): number {
  for (let d = 0; d <= 6; d++) {
    const scaled = step * 10 ** d;
    if (Math.abs(scaled - Math.round(scaled)) < 1e-6) return d;
  }
  return 6;
}

/** A tick number: as many decimals as the step needs (so 1.25 is never
 *  shown as "1.3"), a real minus sign. */
export function tickText(v: number, step: number): string {
  const decimals = stepDecimals(step);
  const s = (Object.is(v, -0) || Math.abs(v) < step * 1e-6 ? 0 : v).toFixed(decimals);
  return s.replace(/^-/, '−');
}

/** Texts for the ticks that are actually LABELLED: one number of decimals
 *  for all of them — the fewest that writes every one exactly, never more
 *  than the step needs (quarter steps labelled every other tick read
 *  "1.0, 1.5, 2.0", not "1.00, 1.50, 2.00"). */
export function tickTexts(values: number[], step: number): string[] {
  const cap = stepDecimals(step);
  let d = 0;
  for (const v of values) d = Math.max(d, Math.min(cap, stepDecimals(Math.abs(v) < step * 1e-6 ? 0 : v)));
  const unit = 10 ** -d;
  return values.map((v) => tickText(v, unit));
}

/** A multiple of π as plain Unicode: `k` steps of π ÷ `divisor` →
 *  "−π", "−π/2", "0", "π/2", "π", "3π/2", "2π". */
export function piTickText(k: number, divisor: number): string {
  if (k === 0) return '0';
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const g = gcd(Math.abs(k), divisor);
  const num = Math.abs(k) / g;
  const den = divisor / g;
  return `${k < 0 ? '−' : ''}${num === 1 ? '' : num}π${den === 1 ? '' : `/${den}`}`;
}

/** Round [lo, hi] outward to multiples of a nice step — an axis that starts
 *  and ends on a numbered gridline. */
export function niceBounds(lo: number, hi: number, maxTicks: number): { min: number; max: number; step: number } {
  if (!(hi > lo)) {
    const pad = Math.abs(lo) > 0 ? Math.abs(lo) * 0.5 : 1;
    lo -= pad;
    hi += pad;
  }
  let step = niceStep(hi - lo, maxTicks);
  let min = Math.floor(lo / step + 1e-9) * step;
  let max = Math.ceil(hi / step - 1e-9) * step;
  // Rounding outward can add intervals; one coarser step brings it back.
  if ((max - min) / step > maxTicks + 1e-9) {
    step = niceStep(max - min, maxTicks);
    min = Math.floor(lo / step + 1e-9) * step;
    max = Math.ceil(hi / step - 1e-9) * step;
  }
  return { min: Number(min.toPrecision(12)), max: Number(max.toPrecision(12)), step };
}

export interface FrameOptions {
  xRange: [number, number];
  yRange: [number, number];
  /** Major tick step. Default: the finest round step whose numbers still
   *  have room at this size (about one per 34 units across, 20 down). */
  xStep?: number;
  yStep?: number;
  /** Ticks at multiples of π ÷ this whole number, labelled "π/2", "π", …
   *  (a trigonometric axis). Takes the place of that axis's step. */
  xPiDivisor?: number;
  yPiDivisor?: number;
  /** Use one step for both axes when neither is given (function graphs:
   *  with equal scales the grid is then made of true squares). */
  commonStep?: boolean;
  xLabel?: string;
  yLabel?: string;
  /** Drawn inside the figure, above the plot. Only what the spec asked for. */
  title?: string;
  /** Plot height ÷ plot width (default 0.8). */
  aspect?: number;
  /** `false` ⇒ no numbers and no vertical grid on x (a categorical or
   *  unscaled axis — the caller draws its own marks in `bottomExtra`). */
  xNumbers?: boolean;
  /** `false` ⇒ no numbers on y, and no horizontal grid (a qualitative
   *  axis — unnumbered lines would suggest a scale that is not there). */
  yNumbers?: boolean;
  /** Extra room under the plot for the caller's own x marks. */
  bottomExtra?: number;
  /** Lower bound for the left margin (rotated category labels overhang). */
  minLeft?: number;
  /** Heavy lines along x = 0 / y = 0 when they are in range (default true). */
  zeroAxes?: boolean;
  /** Stroke width of those lines (default 1.4). */
  axisWidth?: number;
}

export interface Frame {
  W: number;
  /** y just below everything the frame drew (the caller may add a legend). */
  bottom: number;
  plot: { x: number; y: number; w: number; h: number };
  X(v: number): number;
  Y(v: number): number;
  xTicks: number[];
  yTicks: number[];
  /** Grid, border, axes, numbers, labels, title — everything but the data. */
  svg: string;
}

/** Lay out and draw the frame. */
export function buildFrame(o: FrameOptions): Frame {
  const W = FIGURE_WIDTH;
  const [x0, x1] = o.xRange;
  const [y0, y1] = o.yRange;
  const xNumbers = o.xNumbers !== false;
  const yNumbers = o.yNumbers !== false;
  const aspect = o.aspect && o.aspect > 0 ? o.aspect : 0.8;
  // The plot is about (W − 60) wide before the margins are known exactly.
  const roughPlotW = W - 60;
  const roughPlotH = roughPlotW * aspect;
  const xPi = o.xPiDivisor && o.xPiDivisor > 0 ? Math.round(o.xPiDivisor) : 0;
  const yPi = o.yPiDivisor && o.yPiDivisor > 0 ? Math.round(o.yPiDivisor) : 0;
  let xStep = xPi ? Math.PI / xPi : o.xStep && o.xStep > 0 ? o.xStep : niceStep(x1 - x0, Math.max(2, Math.floor(roughPlotW / 34)));
  let yStep = yPi ? Math.PI / yPi : o.yStep && o.yStep > 0 ? o.yStep : niceStep(y1 - y0, Math.max(2, Math.floor(roughPlotH / 20)));
  if (o.commonStep && !o.xStep && !o.yStep && !xPi && !yPi) xStep = yStep = Math.max(xStep, yStep);
  /** The labels of the ticks shown on one axis. */
  const labelsFor = (values: number[], step: number, pi: number): string[] =>
    pi ? values.map((v) => piTickText(Math.round(v / step), pi)) : tickTexts(values, step);
  const yTicks = ticksBetween(y0, y1, yStep);
  const yTexts = yPi ? labelsFor(yTicks, yStep, yPi) : yTicks.map((t) => tickText(t, yStep));
  const yNumW = yNumbers ? Math.max(0, ...yTexts.map((t) => estWidth(t, TICK_FS))) : 0;

  const titleLines = o.title ? wrapText(o.title, W - 20, TITLE_FS) : [];
  const top = titleLines.length > 0 ? 10 + titleLines.length * (TITLE_FS + 3) + 4 : 10;

  // The rotated y label wraps at the plot height; each extra line widens the margin.
  // A one-to-three character label ("y", "pH") is set upright — a rotated
  // single letter reads as a stray mark.
  const yUpright = !!o.yLabel && o.yLabel.length <= 3;
  const yLabelLines = o.yLabel ? (yUpright ? [o.yLabel] : wrapText(o.yLabel, roughPlotH, LABEL_FS)) : [];
  const yLabelW = yUpright ? estWidth(o.yLabel as string, LABEL_FS) + 2 : yLabelLines.length * (LABEL_FS + 2);
  const left = Math.max(o.minLeft ?? 0, 6 + (yLabelW > 0 ? yLabelW + 4 : 0) + (yNumW > 0 ? yNumW + 6 : 2));

  const xTicks = xNumbers ? ticksBetween(x0, x1, xStep) : [];
  const xTexts = xPi ? labelsFor(xTicks, xStep, xPi) : xTicks.map((t) => tickText(t, xStep));
  // Room on the right for half of the last x number.
  const lastXW = xTexts.length > 0 ? estWidth(xTexts[xTexts.length - 1], TICK_FS) : 0;
  const right = Math.max(12, Math.ceil(lastXW / 2) + 3);

  const plot = { x: left, y: top, w: W - left - right, h: 0 };
  plot.h = Math.round(plot.w * aspect);
  const X = (v: number) => plot.x + ((v - x0) / (x1 - x0)) * plot.w;
  const Y = (v: number) => plot.y + plot.h - ((v - y0) / (y1 - y0)) * plot.h;

  const parts: string[] = [];
  titleLines.forEach((line, i) => {
    parts.push(`<text x="${n2(W / 2)}" y="${n2(10 + TITLE_FS + i * (TITLE_FS + 3))}" font-size="${TITLE_FS}" font-weight="600" text-anchor="middle" fill="${INK}">${esc(line)}</text>`);
  });

  // Minor grid, then major grid.
  const minor: string[] = [];
  const major: string[] = [];
  const yMinorStep = yStep / minorDivisions(yStep);
  if (yNumbers) {
    for (const t of ticksBetween(y0, y1, yMinorStep)) minor.push(`M${n2(plot.x)},${n2(Y(t))}H${n2(plot.x + plot.w)}`);
    for (const t of yTicks) major.push(`M${n2(plot.x)},${n2(Y(t))}H${n2(plot.x + plot.w)}`);
  }
  if (xNumbers) {
    const xMinorStep = xStep / minorDivisions(xStep);
    for (const t of ticksBetween(x0, x1, xMinorStep)) minor.push(`M${n2(X(t))},${n2(plot.y)}V${n2(plot.y + plot.h)}`);
    for (const t of xTicks) major.push(`M${n2(X(t))},${n2(plot.y)}V${n2(plot.y + plot.h)}`);
  }
  if (minor.length > 0) parts.push(`<path d="${minor.join('')}" stroke="${GRID_MINOR}" stroke-width="0.7" fill="none"/>`);
  if (major.length > 0) parts.push(`<path d="${major.join('')}" stroke="${GRID_MAJOR}" stroke-width="0.9" fill="none"/>`);
  parts.push(`<rect x="${n2(plot.x)}" y="${n2(plot.y)}" width="${n2(plot.w)}" height="${n2(plot.h)}" fill="none" stroke="${FRAME}" stroke-width="1"/>`);

  if (o.zeroAxes !== false) {
    const aw = n2(o.axisWidth && o.axisWidth > 0 ? o.axisWidth : 1.4);
    if (y0 <= 0 && y1 >= 0) parts.push(`<line x1="${n2(plot.x)}" y1="${n2(Y(0))}" x2="${n2(plot.x + plot.w)}" y2="${n2(Y(0))}" stroke="${INK}" stroke-width="${aw}"/>`);
    if (xNumbers && x0 <= 0 && x1 >= 0) parts.push(`<line x1="${n2(X(0))}" y1="${n2(plot.y)}" x2="${n2(X(0))}" y2="${n2(plot.y + plot.h)}" stroke="${INK}" stroke-width="${aw}"/>`);
  }

  // y numbers — thinned when the rows are closer than a line of type.
  if (yNumbers && yTicks.length > 0) {
    const rowPx = yTicks.length > 1 ? Math.abs(Y(yTicks[1]) - Y(yTicks[0])) : plot.h;
    const every = Math.max(1, Math.ceil((TICK_FS + 2) / rowPx));
    const anchor = anchorIndex(yTicks, every);
    const shown = yTicks.filter((_, i) => (i - anchor) % every === 0);
    labelsFor(shown, yStep, yPi).forEach((text, k) => {
      parts.push(`<text x="${n2(plot.x - 5)}" y="${n2(Y(shown[k]) + TICK_FS * 0.36)}" font-size="${TICK_FS}" text-anchor="end" fill="${MUTED}">${esc(text)}</text>`);
    });
  }
  // x numbers — thinned when neighbours would touch.
  let below = plot.y + plot.h;
  if (xNumbers && xTicks.length > 0) {
    const colPx = xTicks.length > 1 ? Math.abs(X(xTicks[1]) - X(xTicks[0])) : plot.w;
    const widest = Math.max(...xTexts.map((t) => estWidth(t, TICK_FS)));
    const every = Math.max(1, Math.ceil((widest + 5) / colPx));
    const anchor = anchorIndex(xTicks, every);
    const shown = xTicks.filter((_, i) => (i - anchor) % every === 0);
    labelsFor(shown, xStep, xPi).forEach((text, k) => {
      parts.push(`<text x="${n2(X(shown[k]))}" y="${n2(plot.y + plot.h + TICK_FS + 3)}" font-size="${TICK_FS}" text-anchor="middle" fill="${MUTED}">${esc(text)}</text>`);
    });
    below += TICK_FS + 6;
  }
  below += o.bottomExtra ?? 0;

  if (yUpright) {
    parts.push(`<text x="${n2(6 + yLabelW / 2)}" y="${n2(plot.y + plot.h / 2 + LABEL_FS * 0.36)}" font-size="${LABEL_FS}" font-weight="600" text-anchor="middle" fill="${INK}">${esc(o.yLabel as string)}</text>`);
  } else if (yLabelLines.length > 0) {
    const cy = plot.y + plot.h / 2;
    yLabelLines.forEach((line, i) => {
      const cx = 6 + LABEL_FS + i * (LABEL_FS + 2) - 2;
      parts.push(`<text x="${n2(cx)}" y="${n2(cy)}" font-size="${LABEL_FS}" font-weight="600" text-anchor="middle" fill="${INK}" transform="rotate(-90 ${n2(cx)} ${n2(cy)})">${esc(line)}</text>`);
    });
  }
  if (o.xLabel) {
    const lines = wrapText(o.xLabel, plot.w + right, LABEL_FS);
    lines.forEach((line, i) => {
      parts.push(`<text x="${n2(plot.x + plot.w / 2)}" y="${n2(below + LABEL_FS + 2 + i * (LABEL_FS + 2))}" font-size="${LABEL_FS}" font-weight="600" text-anchor="middle" fill="${INK}">${esc(line)}</text>`);
    });
    below += lines.length * (LABEL_FS + 2) + 4;
  }

  return { W, bottom: below + 6, plot, X, Y, xTicks, yTicks, svg: parts.join('') };
}

/** Which tick the thinning keeps: zero when there is one, else the first. */
function anchorIndex(ticks: number[], every: number): number {
  if (every <= 1) return 0;
  const zero = ticks.findIndex((t) => Math.abs(t) < 1e-9);
  return zero >= 0 ? zero % every : 0;
}

export interface LegendEntry {
  label: string;
  color: string;
  dashed?: boolean;
  /** The curve's own stroke pattern (`SERIES_DASHES`), repeated in the swatch. */
  dash?: string;
  /** 'line' (default) or 'dot' for point series. */
  mark?: 'line' | 'dot';
  /** The marker of a point series (default a filled circle). */
  shape?: SeriesShape;
}

/** A wrapping legend row block starting at `y`. Returns its SVG and height. */
export function buildLegend(entries: LegendEntry[], y: number, W: number = FIGURE_WIDTH): { svg: string; height: number } {
  if (entries.length === 0) return { svg: '', height: 0 };
  const parts: string[] = [];
  const rowH = TICK_FS + 7;
  // A patterned swatch is long enough to show a whole repeat of its pattern.
  const sw = entries.some((e) => e.mark !== 'dot' && e.dash) ? 34 : 18;
  let x = 10;
  let row = 0;
  for (const e of entries) {
    const w = sw + 4 + estWidth(e.label, TICK_FS) + 14;
    if (x > 10 && x + w > W - 6) {
      x = 10;
      row++;
    }
    const cy = y + row * rowH + rowH / 2;
    if (e.mark === 'dot') parts.push(e.shape && e.shape !== 'circle' ? shapeMark(e.shape, x + sw / 2, cy, 3.4, e.color) : `<circle cx="${n2(x + sw / 2)}" cy="${n2(cy)}" r="3.4" fill="${e.color}"/>`);
    else if (e.dash) parts.push(`<line x1="${n2(x + 1.2)}" y1="${n2(cy)}" x2="${n2(x + sw - 1.2)}" y2="${n2(cy)}" stroke="${e.color}" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="${e.dash}"/>`);
    else parts.push(`<line x1="${n2(x)}" y1="${n2(cy)}" x2="${n2(x + sw)}" y2="${n2(cy)}" stroke="${e.color}" stroke-width="2.4"${e.dashed ? ' stroke-dasharray="5 3"' : ''}/>`);
    parts.push(`<text x="${n2(x + sw + 4)}" y="${n2(cy + TICK_FS * 0.36)}" font-size="${TICK_FS}" fill="${INK}">${esc(e.label)}</text>`);
    x += w;
  }
  return { svg: parts.join(''), height: (row + 1) * rowH + 4 };
}

/** Wrap a figure body in the standalone root: namespace, viewBox (no pixel
 *  size), font, and an explicit white background. */
export function svgDocument(W: number, H: number, body: string): string {
  const h = Math.ceil(H);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${h}" role="img" preserveAspectRatio="xMidYMid meet" font-family="${FIGURE_FONT}">`
    + `<rect x="0" y="0" width="${W}" height="${h}" fill="#ffffff"/>${body}</svg>`;
}
