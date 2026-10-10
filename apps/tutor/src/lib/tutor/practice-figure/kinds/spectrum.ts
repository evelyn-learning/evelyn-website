/**
 * spectrum — stick and peak plots on a labelled axis.
 *
 * variant 'mass' — a mass spectrum, one bar per isotope (or fragment):
 *   { peaks: Array<{ mz: number; abundance: number; label?: string }>;   // 1–10; label over the bar ("?" = a blank box)
 *     xRange?: [min, max]; xStep?: number; yMax?: number; yStep?: number;
 *     xLabel?: string ('m/z'); yLabel?: string ('Relative abundance (%)');
 *     showValues?: boolean (false) }      // print each abundance over its bar
 * variant 'pes' — a photoelectron spectrum: binding energy on a logarithmic
 *   axis that INCREASES TO THE LEFT, peak height = number of electrons:
 *   { peaks: Array<{ energy: number;      // MJ/mol, > 0
 *                    electrons: number;   // 1–10
 *                    label?: string }>;   // 1–8 peaks; label over the peak ("A", "?" …)
 *     showEnergies?: boolean (true);      // the binding energy printed over each peak
 *     yNumbers?: boolean (false);         // number the electron axis (off: only unit gridlines, heights are compared)
 *     xLabel?: string ('Binding energy (MJ/mol)'); yLabel?: string ('Relative number of electrons') }
 * variant 'lines' — line spectra as strips over one wavelength axis:
 *   { rows: Array<{ label: string; lines: number[];             // 1–5 rows, each 1–12 wavelengths (nm)
 *                   kind?: 'emission' | 'absorption' ('emission') }>;
 *                                          // emission: dark lines on a white strip; absorption: white lines on a dark strip
 *     range?: [min, max] ([400, 700]); step?: number (50); xLabel?: string ('Wavelength (nm)') }
 * variant 'absorbance' — a Beer's-law calibration line (absorbance against concentration):
 *   { slope: number; intercept?: number (0);                    // A = slope · c + intercept
 *     xMax: number; xStep?: number; yMax?: number; yStep?: number;
 *     points?: Array<[concentration, absorbance]>;              // calibration points drawn as dots
 *     sample?: { absorbance: number; guide?: boolean (true) };  // a dashed level line at the sample's absorbance
 *                                          //   (never dropped to the concentration axis: that is the answer)
 *     xLabel?: string ('Concentration (mol/L)'); yLabel?: string ('Absorbance') }
 * Common: title?: string; letterLabels?: 'numerals' | 'roman' — single-letter peak labels (mass, pes)
 * are printed as 1, 2, 3 … or I, II, III ….
 *
 * PES peaks closer than a 1.5 energy ratio (the 2s and 2p peaks of a third-period element): the
 * axis is then drawn from just outside the peaks instead of from whole decades, and the peaks
 * narrower, so the two stand apart — no broken axis, no inset. Peaks that would still start under
 * 8 units apart (a ratio under about 1.12) are refused.
 */
import { FIGURE_WIDTH, LABEL_FS, SERIES_COLORS, TICK_FS, buildFrame, n2, niceBounds, niceStep, tickText, ticksBetween } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, text, titleBlock } from './draw';
import { facts, lab, labBox, numStr, stroke, type Notes } from './draw2';
import { letterAs, readLetterLabels } from './batch3';

export interface MassPeak { mz: number; abundance: number; label?: string }
export interface PesPeak { energy: number; electrons: number; label?: string }
export interface LineRow { label: string; lines: number[]; kind: 'emission' | 'absorption' }
export type SpectrumModel =
  | { variant: 'mass'; peaks: MassPeak[]; xRange: [number, number]; xStep: number; yMax: number; yStep: number; xLabel: string; yLabel: string; showValues: boolean; title?: string }
  | { variant: 'pes'; peaks: PesPeak[]; showEnergies: boolean; yNumbers: boolean; xLabel: string; yLabel: string; title?: string }
  | { variant: 'lines'; rows: LineRow[]; range: [number, number]; step: number; xLabel: string; title?: string }
  | { variant: 'absorbance'; slope: number; intercept: number; xMax: number; xStep: number; yMax: number; yStep: number; points: Array<[number, number]>; sample?: { absorbance: number; guide: boolean }; xLabel: string; yLabel: string; title?: string };

const VARIANTS = ['mass', 'pes', 'lines', 'absorbance'] as const;

export function spectrumModel(r: Reader): SpectrumModel {
  const p = r.p;
  if (!VARIANTS.includes(p.variant as (typeof VARIANTS)[number])) r.fail(`variant must be one of ${VARIANTS.join(', ')}`);
  const title = r.optStr(p.title, 'title', 160);
  const letters = readLetterLabels(r);
  switch (p.variant as (typeof VARIANTS)[number]) {
    case 'mass': {
      const peaks = r.list(p.peaks, 'peaks', 1, 10).map((raw, i): MassPeak => {
        const o = r.obj(raw, `peaks[${i}]`);
        return { mz: r.positive(o.mz, `peaks[${i}].mz`), abundance: r.positive(o.abundance, `peaks[${i}].abundance`), label: letterAs(r.optStr(o.label, `peaks[${i}].label`, 10), letters) };
      });
      peaks.forEach((q, i) => { if (peaks.findIndex((x) => x.mz === q.mz) !== i) r.fail(`peaks: two peaks at m/z ${q.mz}`); });
      const lo = Math.min(...peaks.map((q) => q.mz));
      const hi = Math.max(...peaks.map((q) => q.mz));
      const xStep = r.optStep(p.xStep, 'xStep') ?? (hi - lo + 4 <= 12 ? 1 : niceStep(hi - lo + 4, 8));
      const xRange = r.optRange(p.xRange, 'xRange') ?? [Math.floor((lo - 1.5) / xStep) * xStep, Math.ceil((hi + 1.5) / xStep) * xStep];
      if (lo <= xRange[0] || hi >= xRange[1]) r.fail('xRange must contain every peak, with room on both sides');
      const top = Math.max(...peaks.map((q) => q.abundance));
      const nb = niceBounds(0, top, 6);
      const yMax = r.optNum(p.yMax, 'yMax') ?? nb.max;
      if (yMax < top) r.fail('yMax is below the tallest peak');
      return { variant: 'mass', peaks, xRange, xStep, yMax, yStep: r.optStep(p.yStep, 'yStep') ?? niceStep(yMax, 6), xLabel: r.optStr(p.xLabel, 'xLabel', 40) ?? 'm/z', yLabel: r.optStr(p.yLabel, 'yLabel', 40) ?? 'Relative abundance (%)', showValues: r.bool(p.showValues, 'showValues', false), title };
    }
    case 'pes': {
      const peaks = r.list(p.peaks, 'peaks', 1, 8).map((raw, i): PesPeak => {
        const o = r.obj(raw, `peaks[${i}]`);
        const electrons = r.num(o.electrons, `peaks[${i}].electrons`);
        if (!Number.isInteger(electrons) || electrons < 1 || electrons > 10) r.fail(`peaks[${i}].electrons must be a whole number from 1 to 10`);
        return { energy: r.positive(o.energy, `peaks[${i}].energy`), electrons, label: letterAs(r.optStr(o.label, `peaks[${i}].label`, 6), letters) };
      });
      // Left to right as drawn: decreasing binding energy.
      peaks.sort((a, b) => b.energy - a.energy);
      peaks.forEach((q, i) => { if (i > 0 && peaks[i - 1].energy / q.energy < 1.12) r.fail(`peaks: the binding energies ${peaks[i - 1].energy} and ${q.energy} are too close to draw as two peaks`); });
      return { variant: 'pes', peaks, showEnergies: r.bool(p.showEnergies, 'showEnergies', true), yNumbers: r.bool(p.yNumbers, 'yNumbers', false), xLabel: r.optStr(p.xLabel, 'xLabel', 40) ?? 'Binding energy (MJ/mol)', yLabel: r.optStr(p.yLabel, 'yLabel', 40) ?? 'Relative number of electrons', title };
    }
    case 'lines': {
      const range = r.optRange(p.range, 'range') ?? [400, 700];
      const rows = r.list(p.rows, 'rows', 1, 5).map((raw, i): LineRow => {
        const o = r.obj(raw, `rows[${i}]`);
        if (o.kind !== undefined && o.kind !== 'emission' && o.kind !== 'absorption') r.fail(`rows[${i}].kind must be 'emission' or 'absorption'`);
        const lines = r.list(o.lines, `rows[${i}].lines`, 1, 12).map((v, k) => {
          const nm = r.num(v, `rows[${i}].lines[${k}]`);
          if (nm <= range[0] || nm >= range[1]) r.fail(`rows[${i}].lines[${k}] (${nm}) is outside the range ${range[0]}–${range[1]}`);
          return nm;
        });
        return { label: r.str(o.label, `rows[${i}].label`, 26), lines: [...lines].sort((a, b) => a - b), kind: (o.kind as LineRow['kind']) ?? 'emission' };
      });
      return { variant: 'lines', rows, range, step: r.optStep(p.step, 'step') ?? niceStep(range[1] - range[0], 7), xLabel: r.optStr(p.xLabel, 'xLabel', 40) ?? 'Wavelength (nm)', title };
    }
    default: {
      const slope = r.positive(p.slope, 'slope');
      const intercept = r.optNum(p.intercept, 'intercept') ?? 0;
      const xMax = r.positive(p.xMax, 'xMax');
      const yTop = slope * xMax + intercept;
      const yMax = r.optNum(p.yMax, 'yMax') ?? niceBounds(0, yTop, 6).max;
      const points = (p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 10)).map((raw, i): [number, number] => {
        if (!Array.isArray(raw) || raw.length !== 2) r.fail(`points[${i}] must be [concentration, absorbance]`);
        return [r.num((raw as unknown[])[0], `points[${i}][0]`), r.num((raw as unknown[])[1], `points[${i}][1]`)];
      });
      let sample: { absorbance: number; guide: boolean } | undefined;
      if (p.sample !== undefined && p.sample !== null) {
        const o = r.obj(p.sample, 'sample');
        sample = { absorbance: r.positive(o.absorbance, 'sample.absorbance'), guide: r.bool(o.guide, 'sample.guide', true) };
        if (sample.absorbance > yTop + 1e-9 || sample.absorbance < intercept) r.fail('sample.absorbance is off the calibration line as drawn (beyond xMax)');
      }
      return { variant: 'absorbance', slope, intercept, xMax, xStep: r.optStep(p.xStep, 'xStep') ?? niceStep(xMax, 6), yMax, yStep: r.optStep(p.yStep, 'yStep') ?? niceStep(yMax, 6), points, sample, xLabel: r.optStr(p.xLabel, 'xLabel', 40) ?? 'Concentration (mol/L)', yLabel: r.optStr(p.yLabel, 'yLabel', 40) ?? 'Absorbance', title };
    }
  }
}

/** Labels over peaks: each as low as it can go without touching one already set. */
function stack(items: Array<{ x: number; y: number; s: string; weight?: number }>, floor: number): string {
  const taken: Array<{ x0: number; x1: number; y0: number; y1: number }> = [];
  const out: string[] = [];
  for (const it of items) {
    let y = it.y;
    for (let tries = 0; tries < 8; tries++) {
      const b = labBox(it.x, y, it.s, 'middle', TICK_FS);
      if (!taken.some((q) => b.x0 < q.x1 + 2 && q.x0 < b.x1 + 2 && b.y0 < q.y1 + 1 && q.y0 < b.y1 + 1)) break;
      y -= TICK_FS + 2;
    }
    taken.push(labBox(it.x, y, it.s, 'middle', TICK_FS));
    out.push(lab(it.x, Math.max(floor, y), it.s, 'middle', { weight: it.weight, halo: true }));
  }
  return out.join('');
}

export function renderSpectrum(r: Reader): Drawn {
  const m = spectrumModel(r);
  const W = FIGURE_WIDTH;
  const notes: Notes = [];
  if (m.variant === 'mass') {
    const f = buildFrame({ xRange: m.xRange, yRange: [0, m.yMax * (m.peaks.some((q) => q.label) || m.showValues ? 1.16 : 1.04)], xStep: m.xStep, yStep: m.yStep, xLabel: m.xLabel, yLabel: m.yLabel, title: m.title, aspect: 0.66 });
    const pitch = Math.abs(f.X(m.xRange[0] + 1) - f.X(m.xRange[0]));
    const bw = Math.max(3, Math.min(9, pitch * 0.42));
    const parts = [f.svg];
    const labels: Array<{ x: number; y: number; s: string; weight?: number }> = [];
    for (const q of m.peaks) {
      const x = f.X(q.mz);
      parts.push(`<rect x="${n2(x - bw / 2)}" y="${n2(f.Y(q.abundance))}" width="${n2(bw)}" height="${n2(f.Y(0) - f.Y(q.abundance))}" fill="${INK}"/>`);
      const s = [q.label, m.showValues ? numStr(q.abundance, 2) : ''].filter(Boolean);
      s.forEach((line, k) => labels.push({ x, y: f.Y(q.abundance) - 5 - k * (TICK_FS + 2), s: line as string, weight: k === 0 && q.label ? 600 : undefined }));
    }
    parts.push(stack(labels, f.plot.y + TICK_FS));
    if (m.peaks.length > 8) notes.push({ code: 'too_many_elements', message: `${m.peaks.length} peaks — more than 8 bars crowd at 340 px` });
    if (pitch < 4) notes.push({ code: 'crowded', message: 'one mass unit is drawn under 4 units wide — neighbouring peaks cannot be told apart; narrow xRange' });
    return { body: parts.join(''), H: f.bottom, facts: { ...facts(notes), plot: f.plot } };
  }
  if (m.variant === 'absorbance') {
    const f = buildFrame({ xRange: [0, m.xMax], yRange: [0, m.yMax], xStep: m.xStep, yStep: m.yStep, xLabel: m.xLabel, yLabel: m.yLabel, title: m.title, aspect: 0.72 });
    const parts = [f.svg];
    const yEnd = Math.min(m.yMax, m.slope * m.xMax + m.intercept);
    const xEnd = (yEnd - m.intercept) / m.slope;
    parts.push(`<path d="M${n2(f.X(0))},${n2(f.Y(m.intercept))}L${n2(f.X(xEnd))},${n2(f.Y(yEnd))}" ${stroke(SERIES_COLORS[0], 2.2)}/>`);
    if (m.sample?.guide) {
      const xs = (m.sample.absorbance - m.intercept) / m.slope;
      parts.push(`<path d="M${n2(f.X(0))},${n2(f.Y(m.sample.absorbance))}H${n2(f.X(xs))}" ${stroke(INK, 1.3, '5 3')}/>`);
      const below = f.X(xs) < f.plot.x + 80;
      parts.push(text(below ? f.X(xs) + 8 : f.X(0) + 6, f.Y(m.sample.absorbance) + (below ? 14 : -5), 'sample', { halo: true }));
    }
    for (const [cx, cy] of m.points) parts.push(`<circle cx="${n2(f.X(cx))}" cy="${n2(f.Y(cy))}" r="3.6" fill="${INK}" stroke="#ffffff" stroke-width="1.4"/>`);
    return { body: parts.join(''), H: f.bottom, facts: { ...facts(notes), plot: f.plot } };
  }
  if (m.variant === 'pes') {
    const top = Math.max(...m.peaks.map((q) => q.electrons));
    const hasLabels = m.peaks.some((q) => q.label);
    const head = 1 + (m.showEnergies ? 1 : 0) + (hasLabels ? 1 : 0);
    const f = buildFrame({ xRange: [0, 1], yRange: [0, top * (1 + head * 0.14)], xNumbers: false, yNumbers: false, xLabel: m.xLabel, yLabel: m.yLabel, title: m.title, aspect: 0.62, bottomExtra: TICK_FS + 6, minLeft: m.yNumbers ? 40 : 26 });
    const eMin = Math.min(...m.peaks.map((q) => q.energy));
    const eMax = Math.max(...m.peaks.map((q) => q.energy));
    // Two peaks closer than a 1.5 ratio: the axis runs from just outside the peaks (not from whole
    // decades), which spreads them as far apart as the figure allows.
    const tight = m.peaks.some((q, i) => i > 0 && m.peaks[i - 1].energy / q.energy < 1.5);
    const lo = tight ? Math.log10(eMin / 1.45) : Math.floor(Math.log10(eMin / 1.3));
    const hi = tight ? Math.log10(eMax * 1.45) : Math.ceil(Math.log10(eMax * 1.3));
    // Reversed: the highest energy at the left edge.
    const X = (e: number) => f.plot.x + ((hi - Math.log10(e)) / (hi - lo)) * f.plot.w;
    const base = f.plot.y + f.plot.h;
    const parts = [f.svg];
    const minor: string[] = [];
    const major: string[] = [];
    for (let d = Math.floor(lo); d <= Math.ceil(hi); d++) {
      const on = (e: number): boolean => Math.log10(e) >= lo - 1e-9 && Math.log10(e) <= hi + 1e-9;
      if (on(10 ** d)) {
        major.push(`M${n2(X(10 ** d))},${n2(f.plot.y)}V${n2(base)}`);
        parts.push(text(X(10 ** d), base + TICK_FS + 3, tickText(10 ** d, 10 ** Math.min(d, 0)), { anchor: 'middle', fill: MUTED }));
      }
      if (d < hi) for (let k = 2; k <= 9; k++) if (on(k * 10 ** d)) minor.push(`M${n2(X(k * 10 ** d))},${n2(f.plot.y)}V${n2(base)}`);
    }
    const rows: string[] = [];
    for (let e = 1; e <= top; e++) {
      rows.push(`M${n2(f.plot.x)},${n2(f.Y(e))}H${n2(f.plot.x + f.plot.w)}`);
      if (m.yNumbers && (top <= 6 || e % 2 === 0)) parts.push(text(f.plot.x - 5, f.Y(e) + 4, String(e), { anchor: 'end', fill: MUTED }));
    }
    parts.push(`<path d="${minor.join('')}" ${stroke('#e9eef4', 0.7)}/><path d="${major.join('')}${rows.join('')}" ${stroke('#cbd5e1', 0.9)}/>`);
    // Peaks: narrow bells on the baseline.
    // Peaks nearer than 15 units are drawn narrower, so their bells keep 3 units of paper between them.
    const nearest = Math.min(Infinity, ...m.peaks.slice(1).map((q, i) => X(q.energy) - X(m.peaks[i].energy)));
    if (nearest < 8) r.fail(`peaks: the binding energies ${m.peaks.map((q) => q.energy).filter((_, i) => (i > 0 && X(m.peaks[i].energy) - X(m.peaks[i - 1].energy) < 8) || (i < m.peaks.length - 1 && X(m.peaks[i + 1].energy) - X(m.peaks[i].energy) < 8)).slice(0, 2).join(' and ')} are drawn under 8 units apart — too close to draw as two peaks`);
    const hw = tight ? Math.max(3.4, Math.min(6, (nearest - 3) / 2)) : 6;
    const labels: Array<{ x: number; y: number; s: string; weight?: number }> = [];
    for (const q of m.peaks) {
      const x = X(q.energy);
      const y = f.Y(q.electrons);
      parts.push(`<path d="M${n2(x - hw)},${n2(base)}C${n2(x - hw * 0.35)},${n2(base)} ${n2(x - hw * 0.3)},${n2(y)} ${n2(x)},${n2(y)}C${n2(x + hw * 0.3)},${n2(y)} ${n2(x + hw * 0.35)},${n2(base)} ${n2(x + hw)},${n2(base)}z" fill="${INK}" stroke="${INK}" stroke-width="1.2" stroke-linejoin="round"/>`);
      if (m.showEnergies) labels.push({ x, y: y - 5, s: numStr(q.energy, 2) });
      if (q.label) labels.push({ x, y: y - 5 - (m.showEnergies ? TICK_FS + 3 : 0), s: q.label, weight: 700 });
    }
    parts.push(stack(labels, f.plot.y + TICK_FS));
    parts.push(`<path d="M${n2(f.plot.x)},${n2(base)}H${n2(f.plot.x + f.plot.w)}" ${stroke(INK, 1.4)}/>`);
    const gaps = m.peaks.slice(1).map((q, i) => X(q.energy) - X(m.peaks[i].energy));
    if (gaps.some((g) => g < 13)) notes.push({ code: 'crowded', message: 'two peaks are drawn under 13 units apart — their heights can still be read but their labels stack' });
    return { body: parts.join(''), H: f.bottom, facts: { ...facts(notes), plot: f.plot } };
  }
  // Line spectra.
  const t = titleBlock(m.title, W);
  const parts = [t.svg];
  const left = 16;
  const right = W - 16;
  const X = (nm: number) => left + ((nm - m.range[0]) / (m.range[1] - m.range[0])) * (right - left);
  const ticks = ticksBetween(m.range[0], m.range[1], m.step);
  let y = t.top + 2;
  const stripH = 26;
  m.rows.forEach((row, i) => {
    parts.push(text(left, y + TICK_FS, row.label, { weight: 600 }));
    y += TICK_FS + 5;
    const dark = row.kind === 'absorption';
    parts.push(`<rect x="${left}" y="${n2(y)}" width="${right - left}" height="${stripH}" fill="${dark ? '#374151' : '#ffffff'}" stroke="${INK}" stroke-width="1.2"/>`);
    parts.push(`<path d="${row.lines.map((nm) => `M${n2(X(nm))},${n2(y + 1)}v${stripH - 2}`).join('')}" ${stroke(dark ? '#ffffff' : INK, 2.4)}/>`);
    // Tick stubs under every strip, so a line can be read against the axis below.
    parts.push(`<path d="${ticks.map((v) => `M${n2(X(v))},${n2(y + stripH)}v4`).join('')}" ${stroke(MUTED, 1)}/>`);
    const close = row.lines.slice(1).some((nm, k) => X(nm) - X(row.lines[k]) < 4);
    if (close) notes.push({ code: 'crowded', message: `rows[${i}]: two lines are drawn under 4 units apart and merge into one` });
    y += stripH + 9;
  });
  y += 2;
  ticks.forEach((v) => parts.push(text(X(v), y + TICK_FS - 2, tickText(v, m.step), { anchor: 'middle', fill: MUTED })));
  y += TICK_FS + 4;
  parts.push(text(W / 2, y + LABEL_FS, m.xLabel, { fs: LABEL_FS, anchor: 'middle', weight: 600 }));
  return { body: parts.join(''), H: y + LABEL_FS + 10, facts: facts(notes) };
}
