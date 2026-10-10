/**
 * wave_diagram — batch 4 (2026-10-14). Two variants.
 *
 * variant 'transverse' — a snapshot of a sinusoidal wave (displacement against
 *   position), or the record of one point (displacement against time):
 *   { amplitude: number; wavelength: number;      // with axis 'time' give `period` instead of wavelength
 *     axis?: 'position' | 'time' ('position');
 *     cycles?: number (2);                        // 1–4 in quarter steps: how much of the wave is drawn
 *     start?: 'sine' | 'cosine' ('sine');         // leaves the equilibrium line rising, or starts on a crest
 *     xUnit?: string ('m' | 's'); yUnit?: string ('m');
 *     showAmplitude?: 'value' | 'blank' | 'none';   // a double arrow from the equilibrium line to a crest
 *     showWavelength?: 'value' | 'blank' | 'none';  // a dimension line crest to crest (the period, on a time axis)
 *                                                 //   both default 'value' — and are not drawn at all with `scale`
 *     labels?: Array<'crest' | 'trough' | 'equilibrium'> ([]);   // the words, printed at one of each
 *     points?: Array<{ x: number; label: string }>;   // ≤ 6 lettered dots ON the wave at those positions (times)
 *     direction?: 'right' | 'left';               // an arrow under the wave: the way it travels (position axis only)
 *     speedLabel?: string;                        // printed beside that arrow ("v", "v = 4 m/s")
 *     scale?: boolean (false);                    // numbered axes and a grid — amplitude and wavelength are READ,
 *                                                 //   not printed (showAmplitude / showWavelength / labels refused)
 *     xStep?: number (wavelength ÷ 4); yStep?: number (amplitude ÷ 2); yMax?: number (1.5 × amplitude)   // scale only
 *     title?: string }
 *
 * variant 'standing' — a standing wave on a string fixed at both ends, or in
 *   an air column, one row per harmonic (the two extreme shapes: one solid,
 *   one dashed):
 *   { medium?: 'string' | 'open_open' | 'open_closed' ('string');
 *     harmonics: number[];                        // 1–3 rows, each 1–6; open_closed: odd numbers only (1, 3, 5)
 *     length?: number; unit?: string ('m');
 *     showLength?: 'value' | 'name' | 'blank' | 'none';   // a dimension line under the last row: "1.2 m", "L", "?"
 *                                                 //   default 'value' when length is given, else 'none'
 *     nodes?: 'dots' | 'labels' | 'none' ('dots');      // a filled dot on the axis at every node (+ the letter N)
 *     antinodes?: 'dots' | 'labels' | 'none' ('none');  // an open ring at the top of the loop at every antinode (+ A)
 *     harmonicLabels?: 'value' | 'blank' | 'none' ('none');   // "n = 2" / "n = ?" at the left of each row
 *     title?: string }
 *   An air column is drawn as a tube; its closed end (open_closed: the left
 *   one) is a wall, where the displacement has a node. A string ends in two
 *   clamps. The curves of an air column show the DISPLACEMENT of the air.
 *
 * Nothing that states an answer is drawn unless asked: no values with
 * `scale`, no N / A letters, no harmonic number by default.
 */
import { FIGURE_WIDTH, SERIES_COLORS, TICK_FS, buildFrame, estWidth, n2 } from '../plot-frame';
import type { Drawn, FigureFacts, Reader } from '../spec';
import { INK, MUTED, arrow, text, titleBlock } from './draw';
import { facts as noteFacts, lab, numStr, polyPath, stroke, type Notes, type Pt } from './draw2';

export type WaveShow = 'value' | 'blank' | 'none';
export const WAVE_MEDIA = ['string', 'open_open', 'open_closed'] as const;
export type WaveMedium = (typeof WAVE_MEDIA)[number];

export interface TransverseModel {
  variant: 'transverse';
  axis: 'position' | 'time';
  amplitude: number;
  /** The wavelength (position axis) or the period (time axis). */
  wavelength: number;
  cycles: number;
  start: 'sine' | 'cosine';
  xUnit: string;
  yUnit: string;
  showAmplitude: WaveShow;
  showWavelength: WaveShow;
  labels: Array<'crest' | 'trough' | 'equilibrium'>;
  points: Array<{ x: number; label: string }>;
  direction?: 'right' | 'left';
  speedLabel?: string;
  scale: boolean;
  xStep: number;
  yStep: number;
  yMax: number;
  title?: string;
}
export interface StandingModel {
  variant: 'standing';
  medium: WaveMedium;
  harmonics: number[];
  length?: number;
  unit: string;
  showLength: 'value' | 'name' | 'blank' | 'none';
  nodes: 'dots' | 'labels' | 'none';
  antinodes: 'dots' | 'labels' | 'none';
  harmonicLabels: WaveShow;
  title?: string;
}
export type WaveModel = TransverseModel | StandingModel;

/** Displacement of the drawn wave at position (or time) x. */
export const waveY = (m: TransverseModel, x: number): number => m.amplitude * (m.start === 'sine' ? Math.sin((2 * Math.PI * x) / m.wavelength) : Math.cos((2 * Math.PI * x) / m.wavelength));
/** Slope of the drawn wave at x, as a multiple of amplitude ÷ wavelength (its sign is what matters). */
export const waveSlope = (m: TransverseModel, x: number): number => (m.start === 'sine' ? Math.cos((2 * Math.PI * x) / m.wavelength) : -Math.sin((2 * Math.PI * x) / m.wavelength));
/** Positions of the crests (`sign` 1) or troughs (−1) inside the drawn span, in order. */
export function waveExtrema(m: TransverseModel, sign: 1 | -1): number[] {
  const first = m.start === 'sine' ? (sign > 0 ? 0.25 : 0.75) : sign > 0 ? 0 : 0.5;
  const out: number[] = [];
  for (let k = first; k <= m.cycles + 1e-9; k += 1) out.push(k * m.wavelength);
  return out;
}

/** Wavelength of the n-th harmonic as a multiple of the length: 2/n, or 4/n in a tube closed at one end. */
export const standingWavelengthFactor = (medium: WaveMedium, n: number): number => (medium === 'open_closed' ? 4 : 2) / n;
/** Displacement envelope (−1…1) of the n-th harmonic at the fraction s of the length. */
export const standingShape = (medium: WaveMedium, n: number, s: number): number =>
  medium === 'string' ? Math.sin(n * Math.PI * s) : medium === 'open_open' ? Math.cos(n * Math.PI * s) : Math.sin((n * Math.PI * s) / 2);
/** The nodes and antinodes of the n-th harmonic, as fractions of the length from the left end. */
export function standingPoints(medium: WaveMedium, n: number): { nodes: number[]; antinodes: number[] } {
  const seq = (from: number, step: number): number[] => {
    const out: number[] = [];
    for (let v = from; v <= 1 + 1e-9; v += step) out.push(Math.min(1, Number(v.toFixed(9))));
    return out;
  };
  if (medium === 'string') return { nodes: seq(0, 1 / n), antinodes: seq(1 / (2 * n), 1 / n) };
  if (medium === 'open_open') return { nodes: seq(1 / (2 * n), 1 / n), antinodes: seq(0, 1 / n) };
  return { nodes: seq(0, 2 / n), antinodes: seq(1 / n, 2 / n) };
}

const SHOWS: readonly WaveShow[] = ['value', 'blank', 'none'];

export function waveModel(r: Reader): WaveModel {
  const p = r.p;
  const title = r.optStr(p.title, 'title', 160);
  const oneOf = <T extends string>(v: unknown, name: string, allowed: readonly T[], dflt: T): T => {
    if (v === undefined || v === null) return dflt;
    if (!allowed.includes(v as T)) r.fail(`${name} must be one of ${allowed.join(', ')}`);
    return v as T;
  };
  if (p.variant !== 'transverse' && p.variant !== 'standing') r.fail('variant must be one of transverse, standing');
  if (p.variant === 'standing') {
    const medium = oneOf(p.medium, 'medium', WAVE_MEDIA, 'string');
    const harmonics = r.list(p.harmonics, 'harmonics', 1, 3).map((v, i) => {
      const n = r.num(v, `harmonics[${i}]`);
      if (!Number.isInteger(n) || n < 1 || n > 6) r.fail(`harmonics[${i}] must be a whole number from 1 to 6`);
      if (medium === 'open_closed' && n % 2 === 0) r.fail(`harmonics[${i}]: a tube closed at one end has odd harmonics only (1, 3, 5) — ${n} cannot stand in it`);
      return n;
    });
    const length = p.length === undefined || p.length === null ? undefined : r.positive(p.length, 'length');
    const showLength = oneOf(p.showLength, 'showLength', ['value', 'name', 'blank', 'none'] as const, length === undefined ? 'none' : 'value');
    if (showLength === 'value' && length === undefined) r.fail('showLength: "value" needs length');
    return {
      variant: 'standing', medium, harmonics, length, unit: r.optStr(p.unit, 'unit', 6) ?? 'm', showLength,
      nodes: oneOf(p.nodes, 'nodes', ['dots', 'labels', 'none'] as const, 'dots'),
      antinodes: oneOf(p.antinodes, 'antinodes', ['dots', 'labels', 'none'] as const, 'none'),
      harmonicLabels: oneOf(p.harmonicLabels, 'harmonicLabels', SHOWS, 'none'), title,
    };
  }
  const axis = oneOf(p.axis, 'axis', ['position', 'time'] as const, 'position');
  const amplitude = r.positive(p.amplitude, 'amplitude');
  if (axis === 'time' && p.wavelength !== undefined) r.fail('wavelength: a displacement–time record has a period, not a wavelength — give period');
  if (axis === 'position' && p.period !== undefined) r.fail('period: a snapshot against position has a wavelength, not a period — give wavelength (or axis: "time")');
  const wavelength = axis === 'time' ? r.positive(p.period, 'period') : r.positive(p.wavelength, 'wavelength');
  const cycles = r.optNum(p.cycles, 'cycles') ?? 2;
  if (cycles < 1 || cycles > 4 || Math.abs(cycles * 4 - Math.round(cycles * 4)) > 1e-9) r.fail('cycles must be from 1 to 4, in quarter steps');
  const scale = r.bool(p.scale, 'scale', false);
  const labelsIn = p.labels === undefined || p.labels === null ? [] : r.list(p.labels, 'labels', 0, 3);
  const labels = labelsIn.map((v, i) => oneOf(v, `labels[${i}]`, ['crest', 'trough', 'equilibrium'] as const, 'crest'));
  if (scale) {
    for (const k of ['showAmplitude', 'showWavelength'] as const) if (p[k] !== undefined && p[k] !== null && p[k] !== 'none') r.fail(`${k}: with scale the value is read off the numbered axes — it is not also drawn (leave it out)`);
    if (labels.length) r.fail('labels: not drawn on a scaled graph (the words would sit on the grid numbers) — use points');
  }
  const points = (p.points === undefined || p.points === null ? [] : r.list(p.points, 'points', 0, 6)).map((raw, i) => {
    const o = r.obj(raw, `points[${i}]`);
    const x = r.num(o.x, `points[${i}].x`);
    if (x < 0 || x > cycles * wavelength + 1e-9) r.fail(`points[${i}].x is outside the drawn wave (0 to ${numStr(cycles * wavelength, 3)})`);
    return { x, label: r.str(o.label, `points[${i}].label`, 6) };
  });
  if (new Set(points.map((q) => q.label)).size !== points.length) r.fail('points: two points carry the same label');
  const direction = p.direction === undefined || p.direction === null ? undefined : oneOf(p.direction, 'direction', ['right', 'left'] as const, 'right');
  if (direction && axis === 'time') r.fail('direction: a displacement–time record of one point has no direction of travel');
  const speedLabel = r.optStr(p.speedLabel, 'speedLabel', 16);
  if (speedLabel && !direction) r.fail('speedLabel needs direction');
  const m: TransverseModel = {
    variant: 'transverse', axis, amplitude, wavelength, cycles,
    start: oneOf(p.start, 'start', ['sine', 'cosine'] as const, 'sine'),
    xUnit: r.optStr(p.xUnit, 'xUnit', 6) ?? (axis === 'time' ? 's' : 'm'),
    yUnit: r.optStr(p.yUnit, 'yUnit', 6) ?? 'm',
    showAmplitude: scale ? 'none' : oneOf(p.showAmplitude, 'showAmplitude', SHOWS, 'value'),
    showWavelength: scale ? 'none' : oneOf(p.showWavelength, 'showWavelength', SHOWS, 'value'),
    labels, points, direction, speedLabel, scale,
    xStep: r.optStep(p.xStep, 'xStep') ?? wavelength / 4,
    yStep: r.optStep(p.yStep, 'yStep') ?? amplitude / 2,
    yMax: r.optStep(p.yMax, 'yMax') ?? amplitude * 1.5,
    title,
  };
  if (m.yMax < amplitude) r.fail('yMax is smaller than the amplitude — the crests would be cut off');
  if (m.showWavelength !== 'none' && waveExtrema(m, 1).length < 2 && waveExtrema(m, -1).length < 2) r.fail(`showWavelength: with ${numStr(cycles)} cycle${cycles === 1 ? '' : 's'} drawn there are not two crests (or two troughs) to measure between — draw more cycles`);
  return m;
}

// ---------------------------------------------------------------------------
// Drawing
// ---------------------------------------------------------------------------

const WAVE_COLOR = SERIES_COLORS[0];
const dotMark = (x: number, y: number): string => `<circle cx="${n2(x)}" cy="${n2(y)}" r="3.4" fill="${INK}" stroke="#ffffff" stroke-width="1.2"/>`;

/** A point's letter stands on the open side of the curve: above a falling stretch it moves right, above a rising one left (mirrored below the line). */
function pointDx(m: TransverseModel, x: number): number {
  const s = waveSlope(m, x);
  const up = waveY(m, x) >= -1e-9;
  return Math.abs(s) < 0.3 ? 0 : (s < 0 ? 1 : -1) * (up ? 9 : -9);
}
/** A horizontal dimension line with end ticks, broken round its label (a value, or the "?" box). */
function dim(xa: number, xb: number, y: number, s: string): string {
  const mid = (xa + xb) / 2;
  const half = (s === '?' ? 19 : estWidth(s, TICK_FS)) / 2 + 4;
  const tick = (x: number) => `M${n2(x)},${n2(y - 4)}v8`;
  return `<path d="M${n2(xa)},${n2(y)}H${n2(mid - half)}M${n2(mid + half)},${n2(y)}H${n2(xb)}${tick(xa)}${tick(xb)}" ${stroke(MUTED, 1)}/>` + lab(mid, y + TICK_FS * 0.36, s, 'middle');
}

function renderTransverse(m: TransverseModel): Drawn {
  const span = m.cycles * m.wavelength;
  const N = Math.round(m.cycles * 48);
  const xs = Array.from({ length: N + 1 }, (_, i) => (span * i) / N);
  const notes: Notes = [];
  if (m.scale) {
    const f = buildFrame({
      xRange: [0, span], yRange: [-m.yMax, m.yMax], xStep: m.xStep, yStep: m.yStep,
      xLabel: `${m.axis === 'time' ? 'Time' : 'Position'} (${m.xUnit})`, yLabel: `Displacement (${m.yUnit})`, title: m.title, aspect: 0.62,
    });
    const onGrid = (v: number, step: number) => Math.abs(v / step - Math.round(v / step)) < 1e-6;
    if (!onGrid(m.amplitude, m.yStep / 2)) notes.push({ code: 'not_to_scale', message: 'yStep: the amplitude is not on a gridline (or halfway between two) — it cannot be read off the graph' });
    if (!onGrid(m.wavelength, m.xStep / 2)) notes.push({ code: 'not_to_scale', message: `xStep: the ${m.axis === 'time' ? 'period' : 'wavelength'} is not a whole number of half-steps — it cannot be read off the graph` });
    const parts = [f.svg, `<path d="${polyPath(xs.map((x) => [f.X(x), f.Y(waveY(m, x))] as Pt))}" ${stroke(WAVE_COLOR, 2.4)} stroke-linejoin="round"/>`];
    const marks: FigureFacts['marks'] = [];
    m.points.forEach((q, i) => {
      const [px, py] = [f.X(q.x), f.Y(waveY(m, q.x))];
      // Not pushed to `marks` when it is on the left edge: a wave drawn from x = 0 starts on the axis.
      if (q.x > 0) marks.push({ what: `points[${i}]`, cx: px, cy: py });
      const up = waveY(m, q.x) >= -1e-9;
      parts.push(dotMark(px, py), text(Math.min(f.plot.x + f.plot.w - 6, Math.max(f.plot.x + 8, px + pointDx(m, q.x))), py + (up ? -9 : 17), q.label, { fs: 12, anchor: 'middle', weight: 700, halo: true }));
    });
    let H = f.bottom;
    if (m.direction) {
      const y = f.bottom + 8;
      const cx = f.plot.x + f.plot.w / 2;
      const [a, b] = m.direction === 'right' ? [cx - 24, cx + 24] : [cx + 24, cx - 24];
      parts.push(arrow(a, y, b, y, { width: 2 }));
      if (m.speedLabel) parts.push(lab(Math.max(a, b) + 8, y + 4, m.speedLabel, 'start'));
      H = f.bottom + 22;
    }
    return { body: parts.join(''), H, facts: { plot: f.plot, curveCount: 1, marks, curves: [], notes } };
  }

  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const ampText = m.showAmplitude === 'value' ? `${numStr(m.amplitude, 3)} ${m.yUnit}` : m.showAmplitude === 'blank' ? '?' : '';
  const lamText = m.showWavelength === 'value' ? `${numStr(m.wavelength, 3)} ${m.xUnit}` : m.showWavelength === 'blank' ? '?' : '';
  const crests = waveExtrema(m, 1);
  const troughs = waveExtrema(m, -1);
  // The amplitude arrow stands at the first crest when the wave starts on it, otherwise in the left margin
  // (level with the first crest, joined to it by a dashed guide) — never inside a hump, where its label would not fit.
  const ampInMargin = ampText !== '' && m.start === 'sine';
  const ampAtCrest = ampText !== '' && m.start === 'cosine';
  const ampW = ampText === '' ? 0 : estWidth(ampText === '?' ? '???' : ampText, TICK_FS) + 6;
  const x0 = Math.max(18, ampInMargin || ampAtCrest ? ampW + 22 : 0);
  const x1 = W - 16;
  const A = 40;
  const lamAbove = lamText !== '' && crests.length >= 2;
  const lamBelow = lamText !== '' && !lamAbove;
  const wantsCrest = m.labels.includes('crest');
  const wantsTrough = m.labels.includes('trough');
  const topRoom = Math.max(lamAbove ? 26 : 0, wantsCrest ? (lamAbove ? 42 : 20) : 0, m.points.length ? 20 : 0, 10);
  const botRoom = Math.max(lamBelow ? 26 : 0, wantsTrough ? (lamBelow ? 42 : 20) : 0, m.points.length ? 20 : 0, 10);
  const yEq = t.top + topRoom + A;
  const X = (x: number) => x0 + ((x1 - x0) * x) / span;
  const Y = (y: number) => yEq - (A * y) / m.amplitude;
  const parts: string[] = [t.svg];
  parts.push(`<path d="M${n2(x0 - 6)},${n2(yEq)}H${n2(x1 + 6)}" ${stroke(MUTED, 1.2, '6 4')}/>`);
  parts.push(`<path d="${polyPath(xs.map((x) => [X(x), Y(waveY(m, x))] as Pt))}" ${stroke(WAVE_COLOR, 2.4)} stroke-linejoin="round"/>`);
  if (ampText !== '') {
    const ax = ampAtCrest ? x0 : x0 - 12;
    const top = yEq - A;
    if (ampInMargin) parts.push(`<path d="M${n2(ax - 4)},${n2(top)}H${n2(X(crests[0]))}" ${stroke(MUTED, 1, '3 3')}/>`);
    else parts.push(`<path d="M${n2(ax - 5)},${n2(top)}h10" ${stroke(MUTED, 1)}/>`);
    parts.push(arrow(ax, yEq - 1, ax, top + 1, { color: INK, width: 1.4, head: 7 }), arrow(ax, top + 1, ax, yEq - 1, { color: INK, width: 1.4, head: 7 }));
    parts.push(lab(ax - 7, yEq - A / 2 + 4, ampText, 'end'));
  }
  if (lamText !== '') {
    const [a, b] = lamAbove ? [crests[0], crests[1]] : [troughs[0], troughs[1]];
    const y = lamAbove ? yEq - A - 14 : yEq + A + 14;
    const edge = lamAbove ? yEq - A - 3 : yEq + A + 3;
    parts.push(`<path d="M${n2(X(a))},${n2(edge)}V${n2(y)}M${n2(X(b))},${n2(edge)}V${n2(y)}" ${stroke(MUTED, 1, '3 3')}/>`);
    parts.push(dim(X(a), X(b), y, lamText));
  }
  // The words: at the LAST crest / trough, clear of the dimension line (which uses the first two).
  if (wantsCrest) {
    const c = crests[crests.length - 1];
    const above = lamAbove && crests.length <= 2;
    parts.push(text(Math.min(x1 - 14, Math.max(x0 + 14, X(c))), yEq - A - (above ? 30 : 8), 'crest', { anchor: 'middle' }));
  }
  if (wantsTrough) {
    const c = troughs[troughs.length - 1];
    const below = lamBelow && troughs.length <= 2;
    parts.push(text(Math.min(x1 - 16, Math.max(x0 + 16, X(c))), yEq + A + (below ? 38 : 16), 'trough', { anchor: 'middle' }));
  }
  let bottom = yEq + A + botRoom;
  m.points.forEach((q) => {
    const y = waveY(m, q.x);
    const up = y >= -1e-9;
    parts.push(dotMark(X(q.x), Y(y)), text(X(q.x) + pointDx(m, q.x), Y(y) + (up ? -9 : 18), q.label, { fs: 12, anchor: 'middle', weight: 700, halo: true }));
  });
  if (m.labels.includes('equilibrium') || m.direction) {
    const y = bottom + 12;
    if (m.labels.includes('equilibrium')) {
      // A short sample of the dashed line with the word, as a key (the line itself is crossed by the wave everywhere).
      parts.push(`<path d="M${n2(x0)},${n2(y - 4)}h26" ${stroke(MUTED, 1.2, '6 4')}/>`, text(x0 + 32, y, 'equilibrium position', { anchor: 'start' }));
    }
    if (m.direction) {
      const lw = m.speedLabel ? estWidth(m.speedLabel === '?' ? '???' : m.speedLabel, TICK_FS) + 8 : 0;
      const right = x1 - lw;
      const [a, b] = m.direction === 'right' ? [right - 44, right] : [right, right - 44];
      parts.push(arrow(a, y - 4, b, y - 4, { width: 2 }));
      if (m.speedLabel) parts.push(lab(right + 8, y, m.speedLabel, 'start'));
    }
    bottom = y + 10;
  }
  if (m.cycles > 3 && lamText !== '') notes.push({ code: 'crowded', message: 'cycles: with more than 3 cycles drawn a wavelength is under 90 units wide — its dimension label crowds' });
  return { body: parts.join(''), H: bottom + 4, facts: noteFacts(notes) };
}

function renderStanding(m: StandingModel): Drawn {
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const notes: Notes = [];
  const pipe = m.medium !== 'string';
  const hl = (n: number): string => (m.harmonicLabels === 'value' ? `n = ${n}` : m.harmonicLabels === 'blank' ? 'n = ?' : '');
  const x0 = m.harmonicLabels === 'none' ? 30 : 64;
  const x1 = W - 30;
  const A = 19;
  const rowH = 2 * A + (pipe ? 16 : 6) + (m.antinodes === 'labels' ? 16 : 6) + (m.nodes === 'labels' ? 16 : 6);
  const parts: string[] = [t.svg];
  let y = t.top + 4;
  m.harmonics.forEach((n) => {
    const yc = y + (m.antinodes === 'labels' ? 16 : 6) + (pipe ? 8 : 3) + A;
    const X = (s: number) => x0 + (x1 - x0) * s;
    const S = 24 * Math.max(2, n);
    const curve = (sign: 1 | -1): Pt[] => Array.from({ length: S + 1 }, (_, i) => [X(i / S), yc - sign * A * standingShape(m.medium, n, i / S)] as Pt);
    if (pipe) {
      const wy = A + 6;
      parts.push(`<path d="M${n2(x0)},${n2(yc - wy)}H${n2(x1)}M${n2(x0)},${n2(yc + wy)}H${n2(x1)}" ${stroke(INK, 2)}/>`);
      if (m.medium === 'open_closed') parts.push(`<path d="M${n2(x0)},${n2(yc - wy - 1)}V${n2(yc + wy + 1)}" ${stroke(INK, 4)}/>`);
    } else {
      // The clamps: a short heavy bar at each end of the string.
      parts.push(`<path d="M${n2(x0)},${n2(yc - 13)}v26M${n2(x1)},${n2(yc - 13)}v26" ${stroke(INK, 4)}/>`);
    }
    parts.push(`<path d="M${n2(x0)},${n2(yc)}H${n2(x1)}" ${stroke(MUTED, 1, '2 3')}/>`);
    parts.push(`<path d="${polyPath(curve(-1))}" ${stroke(WAVE_COLOR, 1.6, '5 4')}/>`);
    parts.push(`<path d="${polyPath(curve(1))}" ${stroke(WAVE_COLOR, 2.3)} stroke-linejoin="round"/>`);
    const pts = standingPoints(m.medium, n);
    if (m.antinodes !== 'none') {
      for (const s of pts.antinodes) {
        const ay = yc - A * Math.abs(standingShape(m.medium, n, s));   // at the top of the loop, whichever of the two curves is there
        parts.push(`<circle cx="${n2(X(s))}" cy="${n2(ay)}" r="3.6" fill="#ffffff" stroke="${INK}" stroke-width="1.6"/>`);
        if (m.antinodes === 'labels') parts.push(text(X(s), yc - A - (pipe ? 11 : 7), 'A', { anchor: 'middle', weight: 700, halo: true }));
      }
    }
    if (m.nodes !== 'none') {
      for (const s of pts.nodes) {
        parts.push(`<circle cx="${n2(X(s))}" cy="${n2(yc)}" r="3.4" fill="${INK}" stroke="#ffffff" stroke-width="1"/>`);
        if (m.nodes === 'labels') parts.push(text(X(s), yc + A + (pipe ? 21 : 17), 'N', { anchor: 'middle', weight: 700, halo: true }));
      }
    }
    const h = hl(n);
    if (h) parts.push(h.endsWith('?') ? text(8, yc + 4, 'n =', { anchor: 'start' }) + lab(8 + estWidth('n = ', TICK_FS), yc + 4, '?', 'start') : text(8, yc + 4, h, { anchor: 'start' }));
    y += rowH + 8;
  });
  let bottom = y - 4;
  if (m.showLength !== 'none') {
    const s = m.showLength === 'value' ? `${numStr(m.length as number, 3)} ${m.unit}` : m.showLength === 'name' ? 'L' : '?';
    parts.push(dim(x0, x1, bottom + 12, s));
    bottom += 26;
  }
  if (Math.max(...m.harmonics) >= 5 && m.nodes === 'labels' && m.antinodes === 'labels') notes.push({ code: 'crowded', message: 'harmonics: with the 5th or 6th harmonic and both N and A letters the letters stand under 30 units apart — label one kind only' });
  return { body: parts.join(''), H: bottom + 6, facts: noteFacts(notes) };
}

export function renderWaveDiagram(r: Reader, _uid?: string): Drawn {
  const m = waveModel(r);
  return m.variant === 'standing' ? renderStanding(m) : renderTransverse(m);
}
