/**
 * gel_electrophoresis — a schematic gel, or (variant 'amplification_plot') a
 * qPCR amplification plot.
 *
 * variant 'gel' (the default):
 *   { ladder: { sizes: number[];          // 2–10 marker sizes
 *               unit?: 'bp' | 'kb' | 'kDa' ('bp');
 *               label?: string | '?' | null;        // over the ladder lane ('Ladder', or 'L' when lanes are narrow)
 *               blank?: number[];                   // sizes whose printed label is a "?" box
 *               hide?: number[] };                  // sizes printed with no label at all
 *     lanes: Array<{ label?: string | '?' | null;  // 1–7 lanes, left to right
 *                    bands: Array<number | { size: number; thick?: 1 | 2 | 3 (1);
 *                                            label?: 'size' | string }> }>;   // a band's size is NEVER printed
 *                                                   //   unless its label asks ('size', or any text, "?" = a box)
 *     guides?: boolean (true);            // faint lines across the gel at the level of each ladder band
 *     electrodes?: boolean (false);       // "−" at the wells' end, "+" at the far end
 *     title?: string }
 *   Wells are at the top; a band's distance from the wells is linear in the
 *   LOGARITHM of its size (equal ratios of size are equal distances), so a
 *   band's size can be read against the ladder by interpolation. A band must
 *   lie within 1.3 × of the ladder's largest and smallest marker.
 *
 * variant 'amplification_plot':
 *   { samples: Array<{ label: string | '?';         // 1–4 curves; "?" is a blank box in the legend
 *                      ct: number | null;           // the cycle at which it crosses the threshold (5 … cycles − 3);
 *                                                   //   null: no amplification (a flat line — a no-template control)
 *                      plateau?: number }>;         // (1, 0.94, 0.88, 0.82 in order) final fluorescence, 0.5–1.1
 *     cycles?: number (40);               // 20–45
 *     threshold?: number (0.1);           // 0.05–0.3, in the units of the fluorescence axis
 *     showThreshold?: boolean (true);     // the dashed threshold line and its name
 *     xLabel?: string ('Cycle'); yLabel?: string ('Fluorescence (relative)'); title?: string }
 *   Each curve doubles per cycle while it is small and crosses the threshold
 *   EXACTLY at its Ct; the grid has a line at every cycle, numbered every five.
 *   No Ct is ever printed.
 */
import { FIGURE_WIDTH, SERIES_COLORS, TICK_FS, assignDashes, buildFrame, dashAttr, estWidth, n2, GUIDE_COLOR, GUIDE_DASH, GUIDE_WIDTH } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, text, titleBlock } from './draw';
import { facts, lab, numStr, stroke, type Notes } from './draw2';

export interface GelBand { size: number; thick: 1 | 2 | 3; label?: string }
export interface GelLane { label: string | null; bands: GelBand[] }
export interface GelModel {
  variant: 'gel';
  ladder: { sizes: number[]; unit: string; label: string | null | undefined; blank: number[]; hide: number[] };
  lanes: GelLane[];
  guides: boolean;
  electrodes: boolean;
  /** Where a band of this size lies between the wells' end (0) and the far end (1) of the band area: linear in log(size). */
  fraction(size: number): number;
  /** The same as a distance from the top of the gel, in canvas units. */
  position(size: number): number;
  title?: string;
}
export interface AmpSample { label: string; ct: number | null; plateau: number }
export interface AmpModel { variant: 'amplification_plot'; samples: AmpSample[]; cycles: number; threshold: number; showThreshold: boolean; xLabel: string; yLabel: string; title?: string }

/** Fluorescence of a sample at a cycle: 0 for a control that never amplifies; else a curve that
 *  doubles per cycle while small, crosses `threshold` exactly at `ct`, and levels off at `plateau`. */
export function amplification(ct: number | null, cycle: number, threshold: number, plateau = 1): number {
  if (ct === null) return 0;
  return plateau / (1 + ((plateau - threshold) / threshold) * 2 ** -(cycle - ct));
}

const GEL_H = 190;
const BAND_TOP = 30;
const BAND_BOTTOM = 14;

export function gelModel(r: Reader): GelModel | AmpModel {
  const p = r.p;
  const variant = p.variant === undefined || p.variant === null ? 'gel' : p.variant;
  if (variant !== 'gel' && variant !== 'amplification_plot') r.fail('variant must be one of gel, amplification_plot');
  const title = r.optStr(p.title, 'title', 160);
  if (variant === 'amplification_plot') {
    const cycles = r.optNum(p.cycles, 'cycles') ?? 40;
    if (!Number.isInteger(cycles) || cycles < 20 || cycles > 45) r.fail('cycles must be a whole number from 20 to 45');
    const threshold = r.optNum(p.threshold, 'threshold') ?? 0.1;
    if (threshold < 0.05 || threshold > 0.3) r.fail('threshold must be between 0.05 and 0.3');
    const samples = r.list(p.samples, 'samples', 1, 4).map((raw, i): AmpSample => {
      const o = r.obj(raw, `samples[${i}]`);
      const ct = o.ct === null ? null : r.num(o.ct, `samples[${i}].ct`);
      if (ct !== null && (ct < 5 || ct > cycles - 3)) r.fail(`samples[${i}].ct must be between 5 and ${cycles - 3} (or null for no amplification)`);
      const plateau = r.optNum(o.plateau, `samples[${i}].plateau`) ?? [1, 0.94, 0.88, 0.82][i];
      if (plateau < 0.5 || plateau > 1.1) r.fail(`samples[${i}].plateau must be between 0.5 and 1.1`);
      return { label: r.str(o.label, `samples[${i}].label`, 16), ct, plateau };
    });
    samples.forEach((s, i) => { if (s.label !== '?' && samples.findIndex((x) => x.label === s.label) !== i) r.fail(`samples: the label "${s.label}" is used twice`); });
    return { variant, samples, cycles, threshold, showThreshold: r.bool(p.showThreshold, 'showThreshold', true), xLabel: r.optStr(p.xLabel, 'xLabel', 40) ?? 'Cycle', yLabel: r.optStr(p.yLabel, 'yLabel', 40) ?? 'Fluorescence (relative)', title };
  }
  const lo = r.obj(p.ladder, 'ladder');
  const sizes = r.list(lo.sizes, 'ladder.sizes', 2, 10).map((v, i) => r.positive(v, `ladder.sizes[${i}]`)).sort((a, b) => b - a);
  sizes.forEach((s, i) => { if (i > 0 && sizes[i - 1] === s) r.fail(`ladder.sizes: ${s} is listed twice`); });
  const subset = (v: unknown, name: string): number[] => (v === undefined || v === null ? [] : r.list(v, name, 0, 10)).map((x) => {
    if (!sizes.includes(x as number)) r.fail(`${name}: ${String(x)} is not one of the ladder sizes`);
    return x as number;
  });
  const unit = lo.unit === undefined || lo.unit === null ? 'bp' : lo.unit;
  if (unit !== 'bp' && unit !== 'kb' && unit !== 'kDa') r.fail('ladder.unit must be one of bp, kb, kDa');
  const [big, small] = [sizes[0], sizes[sizes.length - 1]];
  const lanes = r.list(p.lanes, 'lanes', 1, 7).map((raw, i): GelLane => {
    const o = r.obj(raw, `lanes[${i}]`);
    const bands = r.list(o.bands, `lanes[${i}].bands`, 0, 8).map((b, k): GelBand => {
      const at = `lanes[${i}].bands[${k}]`;
      const bo = typeof b === 'number' ? { size: b } : r.obj(b, at);
      const size = r.positive(bo.size, typeof b === 'number' ? at : `${at}.size`);
      if (size > big * 1.3 || size < small / 1.3) r.fail(`${at} (${size}) is outside the range the ladder spans (${small}–${big} ${unit}) — a size cannot be read there`);
      const thick = (bo as Record<string, unknown>).thick === undefined ? 1 : (bo as Record<string, unknown>).thick;
      if (thick !== 1 && thick !== 2 && thick !== 3) r.fail(`${at}.thick must be 1, 2 or 3`);
      const label = r.optStr((bo as Record<string, unknown>).label, `${at}.label`, 10);
      return { size, thick: thick as 1 | 2 | 3, label: label === 'size' ? numStr(size, 2) : label };
    }).sort((a, b) => b.size - a.size);
    return { label: o.label === null ? null : r.optStr(o.label, `lanes[${i}].label`, 10) ?? null, bands };
  });
  const top = Math.log(big * 1.5);
  const span = top - Math.log(small / 1.5);
  const fraction = (size: number): number => (top - Math.log(size)) / span;
  return {
    variant: 'gel',
    ladder: { sizes, unit: unit as string, label: lo.label === null ? null : r.optStr(lo.label, 'ladder.label', 10), blank: subset(lo.blank, 'ladder.blank'), hide: subset(lo.hide, 'ladder.hide') },
    lanes, guides: r.bool(p.guides, 'guides', true), electrodes: r.bool(p.electrodes, 'electrodes', false),
    fraction, position: (size) => BAND_TOP + fraction(size) * (GEL_H - BAND_TOP - BAND_BOTTOM), title,
  };
}

/** The gel's horizontal layout, and what the ladder lane is headed with (its own label; else "Ladder", or "L" when the lanes are narrow). */
export function gelLayout(m: GelModel): { gx0: number; gx1: number; laneW: number; ladderLabel: string | null } {
  const numW = Math.max(estWidth(m.ladder.unit, TICK_FS), ...m.ladder.sizes.map((s) => estWidth(m.ladder.blank.includes(s) ? '???' : numStr(s, 2), TICK_FS)));
  const gx0 = 8 + numW + 7;
  const gx1 = FIGURE_WIDTH - (m.electrodes ? 24 : 10);
  const laneW = (gx1 - gx0) / (m.lanes.length + 1);
  return { gx0, gx1, laneW, ladderLabel: m.ladder.label === undefined ? (laneW >= 48 ? 'Ladder' : 'L') : m.ladder.label };
}

function renderAmplification(m: AmpModel): Drawn {
  const notes: Notes = [];
  const f = buildFrame({ xRange: [0, m.cycles], yRange: [-0.06, 1.2], xStep: 5, yStep: 0.2, xLabel: m.xLabel, yLabel: m.yLabel, title: m.title, aspect: 0.7, zeroAxes: false });
  const parts = [f.svg];
  if (m.showThreshold) {
    parts.push(`<path d="M${n2(f.plot.x)},${n2(f.Y(m.threshold))}H${n2(f.plot.x + f.plot.w)}" ${stroke(GUIDE_COLOR, GUIDE_WIDTH, GUIDE_DASH)}/>`);
    parts.push(text(f.plot.x + 6, f.Y(m.threshold) - 5, 'threshold', { halo: true }));
  }
  const dashes = assignDashes(m.samples.map(() => false));
  m.samples.forEach((s, i) => {
    const pts: string[] = [];
    for (let c = 0; c <= m.cycles + 1e-9; c += 0.25) pts.push(`${c === 0 ? 'M' : 'L'}${n2(f.X(c))},${n2(f.Y(amplification(s.ct, c, m.threshold, s.plateau)))}`);
    parts.push(`<path d="${pts.join('')}" fill="none" stroke="${SERIES_COLORS[i]}" stroke-width="2.2" stroke-linejoin="round"${dashes[i] ? ' stroke-linecap="round"' : ''}${dashAttr(dashes[i])}/>`);
    if (s.ct !== null && Math.abs(s.ct - Math.round(s.ct)) > 1e-9) notes.push({ code: 'crowded', message: `samples[${i}].ct (${s.ct}) falls between two gridlines — the grid has a line at every whole cycle, and a Ct can be read no finer` });
    m.samples.slice(0, i).forEach((o, k) => { if (o.ct !== null && s.ct !== null && Math.abs(o.ct - s.ct) < 1) notes.push({ code: 'crowded', message: `samples[${k}] and samples[${i}] cross the threshold under one cycle apart — their curves run on top of each other` }); });
  });
  // Legend: a swatch in the curve's own pattern, then its name (a "?" as a box).
  let x = 10;
  let y = f.bottom;
  const rowH = TICK_FS + 9;
  const sw = m.samples.length > 1 ? 34 : 18;
  for (const [i, s] of m.samples.entries()) {
    const w = sw + 4 + (s.label === '?' ? 22 : estWidth(s.label, TICK_FS)) + 14;
    if (x > 10 && x + w > FIGURE_WIDTH - 6) { x = 10; y += rowH; }
    const cy = y + rowH / 2;
    parts.push(`<line x1="${n2(x + 1.2)}" y1="${n2(cy)}" x2="${n2(x + sw - 1.2)}" y2="${n2(cy)}" stroke="${SERIES_COLORS[i]}" stroke-width="2.4"${dashes[i] ? ` stroke-linecap="round" stroke-dasharray="${dashes[i]}"` : ''}/>`);
    parts.push(lab(x + sw + 4, cy + TICK_FS * 0.36, s.label, 'start', {}));
    x += w;
  }
  return { body: parts.join(''), H: y + rowH + 4, facts: { ...facts(notes), plot: f.plot } };
}

export function renderGel(r: Reader): Drawn {
  const m = gelModel(r);
  if (m.variant === 'amplification_plot') return renderAmplification(m);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const parts: string[] = [];
  const sizeText = (s: number): string => numStr(s, 2);
  const { gx0, gx1, laneW, ladderLabel } = gelLayout(m);
  const nLanes = m.lanes.length + 1;
  const labelRow = TICK_FS + 7;
  const gy0 = t.top + labelRow;
  const laneX = (i: number): number => gx0 + laneW * (i + 0.5);
  const Y = (size: number): number => gy0 + m.position(size);
  parts.push(`<rect x="${n2(gx0)}" y="${n2(gy0)}" width="${n2(gx1 - gx0)}" height="${GEL_H}" rx="3" fill="#e8edf3" stroke="#94a3b8" stroke-width="1"/>`);
  if (m.guides) parts.push(`<path d="${m.ladder.sizes.map((s) => `M${n2(gx0 + laneW)},${n2(Y(s))}H${n2(gx1 - 3)}`).join('')}" ${stroke('#b6c2d1', 0.8, '2 3')}/>`);
  // Wells.
  const wellW = Math.min(laneW * 0.56, 34);
  for (let i = 0; i < nLanes; i++) parts.push(`<rect x="${n2(laneX(i) - wellW / 2)}" y="${n2(gy0 + 8)}" width="${n2(wellW)}" height="7" fill="#ffffff" stroke="${INK}" stroke-width="1"/>`);
  const bandW = Math.min(laneW * 0.64, 40);
  const band = (x: number, size: number, thick: number): string => {
    const h = 1 + thick * 2;
    return `<rect x="${n2(x - bandW / 2)}" y="${n2(Y(size) - h / 2)}" width="${n2(bandW)}" height="${h}" fill="${INK}"/>`;
  };
  // Ladder: bands and the size numbers to their left.
  parts.push(text(gx0 - 6, gy0 - 6, m.ladder.unit, { anchor: 'end', fill: MUTED, weight: 600 }));
  m.ladder.sizes.forEach((s, i) => {
    parts.push(band(laneX(0), s, 1));
    if (!m.ladder.hide.includes(s)) parts.push(lab(gx0 - 6, Y(s) + TICK_FS * 0.36, m.ladder.blank.includes(s) ? '?' : sizeText(s), 'end', {}));
    if (i > 0 && Y(s) - Y(m.ladder.sizes[i - 1]) < 10) notes.push({ code: 'crowded', message: `ladder.sizes: ${m.ladder.sizes[i - 1]} and ${s} are drawn under 10 units apart — their labels run together; leave one out` });
  });
  if (ladderLabel) parts.push(lab(laneX(0), gy0 - 6, ladderLabel, 'middle', { weight: 600 }));
  m.lanes.forEach((lane, i) => {
    const x = laneX(i + 1);
    if (lane.label) parts.push(lab(x, gy0 - 6, lane.label, 'middle', { weight: 600 }));
    lane.bands.forEach((b, k) => {
      parts.push(band(x, b.size, b.thick));
      if (b.label) parts.push(lab(x, Y(b.size) - b.thick - 4, b.label, 'middle', { halo: true }));
      if (k > 0 && Y(b.size) - Y(lane.bands[k - 1].size) < 6) notes.push({ code: 'crowded', message: `lanes[${i}]: the bands at ${lane.bands[k - 1].size} and ${b.size} are drawn under 6 units apart and merge into one` });
    });
  });
  if (m.electrodes) parts.push(text(gx1 + 12, gy0 + 16, '−', { fs: 14, anchor: 'middle', weight: 700 }), text(gx1 + 12, gy0 + GEL_H - 6, '+', { fs: 14, anchor: 'middle', weight: 700 }));
  if (laneW < 34) notes.push({ code: 'too_many_elements', message: `${m.lanes.length} lanes leave ${Math.floor(laneW)} units each at 340 px` });
  return { body: t.svg + parts.join(''), H: gy0 + GEL_H + 8, facts: facts(notes) };
}
