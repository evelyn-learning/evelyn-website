/**
 * doppler_wavefronts — batch 5 (2026-10-16): a source moving through the
 * circular wavefronts it has emitted, seen from above. Every front is a
 * circle centred WHERE THE SOURCE WAS when it was emitted, so the spacing
 * ahead and behind is computed, never sketched: (1 − vₛ/v)·λ ahead,
 * (1 + vₛ/v)·λ behind.
 *
 *   { // EITHER the ratio alone, OR both speeds:
 *     speedRatio?: number;                       // v_source ÷ v_wave, 0 to 3 (above 1 = supersonic)
 *     waveSpeed?: number; sourceSpeed?: number;  // both, in `speedUnit` ('m/s')
 *     frequency?: number; frequencyUnit?: string ('Hz');   // of the source — only ever printed in the key
 *     fronts?: number (5, 3–8);                  // wavefronts drawn, one period apart
 *     direction?: 'right' | 'left' ('right');    // the way the source moves
 *     observers?: Array<{ position: 'ahead' | 'behind'; label?: string }>;   // ≤ 2, one per side; default names "X" (ahead), "Y" (behind)
 *     letterLabels?: 'numerals' | 'roman';       // single-letter observer / source names print as 1, 2 … or I, II … (never an option letter)
 *     sourceLabel?: string ('S');
 *     showSourceSpeed?: 'value' | 'blank' | 'none';   // on the velocity arrow ('value' when the speeds are given, else 'none')
 *     showWaveSpeed?: 'value' | 'blank' | 'none';     // key line "Wave speed: …" (same default)
 *     showRatio?: 'value' | 'blank' | 'none' ('none');        // key line "Source speed ÷ wave speed: …"
 *     showFrequency?: 'value' | 'blank' | 'none';     // key line "Source frequency: …" ('value' when `frequency` is given)
 *     shockCone?: boolean (false);               // the two Mach lines — supersonic only
 *     coneAngle?: 'value' | 'blank' | 'none' ('none');        // the half-angle between the direction of motion and a Mach line
 *     emissionPoints?: boolean (false);          // a small dot where each front was emitted
 *     title?: string }
 *
 * Nothing that states an answer is printed unless asked: no observed
 * frequency, no "higher / lower pitch", no Mach number.
 */
import { FIGURE_WIDTH, SERIES_COLORS, TICK_FS, estWidth, n2 } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arcPath, arrow, text, titleBlock } from './draw';
import { facts, lab, numStr, seg, stroke, type Notes, type Show, SHOWS } from './draw2';

export interface DopplerObserver { position: 'ahead' | 'behind'; label: string }
export interface DopplerModel {
  /** v_source ÷ v_wave. */
  ratio: number;
  waveSpeed?: number;
  sourceSpeed?: number;
  speedUnit: string;
  frequency?: number;
  frequencyUnit: string;
  fronts: number;
  direction: 'right' | 'left';
  observers: DopplerObserver[];
  sourceLabel: string;
  showSourceSpeed: Show;
  showWaveSpeed: Show;
  showRatio: Show;
  showFrequency: Show;
  shockCone: boolean;
  coneAngle: Show;
  emissionPoints: boolean;
  title?: string;
}

const NUMERALS = ['1', '2', '3'];
const ROMAN = ['I', 'II', 'III'];

/** The half-angle of the shock cone in degrees: sin θ = v_wave ÷ v_source. */
export const machAngle = (ratio: number): number => (Math.asin(1 / ratio) * 180) / Math.PI;

export function dopplerModel(r: Reader): DopplerModel {
  const p = r.p;
  const show = (v: unknown, name: string, dflt: Show): Show => {
    if (v === undefined || v === null) return dflt;
    if (typeof v !== 'string' || !SHOWS.includes(v as Show)) r.fail(`${name} must be one of ${SHOWS.join(', ')}`);
    return v as Show;
  };
  const hasRatio = p.speedRatio !== undefined && p.speedRatio !== null;
  const hasSpeeds = (p.waveSpeed !== undefined && p.waveSpeed !== null) || (p.sourceSpeed !== undefined && p.sourceSpeed !== null);
  if (hasRatio && hasSpeeds) r.fail('give speedRatio, or waveSpeed and sourceSpeed — not both');
  if (!hasRatio && !hasSpeeds) r.fail('speedRatio (source speed ÷ wave speed) is required — or give waveSpeed and sourceSpeed');
  let ratio: number;
  let waveSpeed: number | undefined;
  let sourceSpeed: number | undefined;
  if (hasSpeeds) {
    waveSpeed = r.positive(p.waveSpeed, 'waveSpeed');
    sourceSpeed = r.num(p.sourceSpeed, 'sourceSpeed');
    if (sourceSpeed < 0) r.fail('sourceSpeed must be 0 or more (the direction is given by direction)');
    ratio = sourceSpeed / waveSpeed;
  } else {
    ratio = r.num(p.speedRatio, 'speedRatio');
    if (ratio < 0) r.fail('speedRatio must be 0 or more (the direction is given by direction)');
  }
  if (ratio > 3) r.fail(`${hasSpeeds ? 'sourceSpeed ÷ waveSpeed' : 'speedRatio'} is ${numStr(ratio, 2)} — above 3 the cone is too narrow to draw`);
  const frontsRaw = r.optNum(p.fronts, 'fronts') ?? 5;
  if (!Number.isInteger(frontsRaw) || frontsRaw < 3 || frontsRaw > 8) r.fail('fronts must be a whole number from 3 to 8');
  const direction = p.direction === undefined || p.direction === null ? 'right' : p.direction;
  if (direction !== 'right' && direction !== 'left') r.fail('direction must be one of right, left');
  let letters: string[] | undefined;
  if (p.letterLabels !== undefined && p.letterLabels !== null) {
    if (p.letterLabels !== 'numerals' && p.letterLabels !== 'roman') r.fail('letterLabels must be one of numerals, roman');
    letters = p.letterLabels === 'numerals' ? NUMERALS : ROMAN;
  }
  const raw = p.observers === undefined || p.observers === null ? [] : r.list(p.observers, 'observers', 0, 2);
  let nth = 0;
  const rename = (s: string): string => (letters && /^[A-Za-z]$/.test(s) ? letters[nth++] : s);
  const observers = raw.map((ov, i): DopplerObserver => {
    const o = r.obj(ov, `observers[${i}]`);
    if (o.position !== 'ahead' && o.position !== 'behind') r.fail(`observers[${i}].position must be one of ahead, behind`);
    const position = o.position as 'ahead' | 'behind';
    return { position, label: rename(r.optStr(o.label, `observers[${i}].label`, 10) ?? (position === 'ahead' ? 'X' : 'Y')) };
  });
  if (observers.length === 2 && observers[0].position === observers[1].position) r.fail(`observers: two observers ${observers[0].position} — one per side`);
  if (observers.length === 2 && observers[0].label === observers[1].label) r.fail(`observers: both are labelled "${observers[0].label}"`);
  // The default "S" is not an option letter and stays; a single letter the author chose is renamed with the observers'.
  const sourceLabel = p.sourceLabel === undefined || p.sourceLabel === null || p.sourceLabel === '' ? 'S' : rename(r.str(p.sourceLabel, 'sourceLabel', 10));
  if (observers.some((o) => o.label === sourceLabel)) r.fail(`sourceLabel "${sourceLabel}" is also the label of an observer`);
  const showSourceSpeed = show(p.showSourceSpeed, 'showSourceSpeed', hasSpeeds ? 'value' : 'none');
  const showWaveSpeed = show(p.showWaveSpeed, 'showWaveSpeed', hasSpeeds ? 'value' : 'none');
  if (!hasSpeeds && showSourceSpeed === 'value') r.fail('showSourceSpeed: "value" needs waveSpeed and sourceSpeed (only speedRatio was given)');
  if (!hasSpeeds && showWaveSpeed === 'value') r.fail('showWaveSpeed: "value" needs waveSpeed and sourceSpeed (only speedRatio was given)');
  const frequency = p.frequency === undefined || p.frequency === null ? undefined : r.positive(p.frequency, 'frequency');
  const showFrequency = show(p.showFrequency, 'showFrequency', frequency === undefined ? 'none' : 'value');
  if (frequency === undefined && showFrequency === 'value') r.fail('showFrequency: "value" needs frequency');
  const shockCone = r.bool(p.shockCone, 'shockCone', false);
  if (shockCone && !(ratio > 1)) r.fail(`shockCone: there is a cone only when the source is faster than the wave (the ratio here is ${numStr(ratio, 2)})`);
  const coneAngle = show(p.coneAngle, 'coneAngle', 'none');
  if (coneAngle !== 'none' && !shockCone) r.fail('coneAngle needs shockCone: true');
  return {
    ratio, waveSpeed, sourceSpeed, speedUnit: r.optStr(p.speedUnit, 'speedUnit', 8) ?? 'm/s', frequency, frequencyUnit: r.optStr(p.frequencyUnit, 'frequencyUnit', 8) ?? 'Hz',
    fronts: frontsRaw, direction, observers, sourceLabel,
    showSourceSpeed, showWaveSpeed, showRatio: show(p.showRatio, 'showRatio', 'none'), showFrequency, shockCone, coneAngle,
    emissionPoints: r.bool(p.emissionPoints, 'emissionPoints', false), title: r.optStr(p.title, 'title', 160),
  };
}

/** What the arrow, the key lines and the cone print (a "?" = a blank box; '' = nothing). */
export function dopplerTexts(m: DopplerModel): { sourceSpeed: string; key: Array<{ role: string; lead: string; value: string }>; coneAngle: string } {
  const v = (s: Show, value: () => string): string => (s === 'value' ? value() : s === 'blank' ? '?' : '');
  const key: Array<{ role: string; lead: string; value: string }> = [];
  const add = (role: string, lead: string, value: string) => { if (value) key.push({ role, lead, value }); };
  add('wave speed', 'Wave speed:', v(m.showWaveSpeed, () => `${numStr(m.waveSpeed as number, 3)} ${m.speedUnit}`));
  add('speed ratio', 'Source speed ÷ wave speed:', v(m.showRatio, () => numStr(m.ratio, 3)));
  add('source frequency', 'Source frequency:', v(m.showFrequency, () => `${numStr(m.frequency as number, 3)} ${m.frequencyUnit}`));
  return {
    sourceSpeed: v(m.showSourceSpeed, () => `${numStr(m.sourceSpeed as number, 3)} ${m.speedUnit}`),
    key,
    coneAngle: v(m.coneAngle, () => `${numStr(machAngle(m.ratio), 1)}°`),
  };
}

export interface DopplerGeometry {
  /** One undisturbed wavelength, in canvas units. */
  lambda: number;
  /** The source now. */
  xs: number;
  yc: number;
  /** +1 moving right, −1 moving left. */
  dir: 1 | -1;
  /** The fronts, newest first: centre and radius. */
  circles: Array<{ cx: number; r: number }>;
  observers: Array<{ x: number; label: string; position: 'ahead' | 'behind' }>;
  top: number;
  bottom: number;
}

const ARROW_ROOM = 46;
const OBS_ROOM = 40;

/** Where everything is drawn (`top` = the y the figure's own content starts at). */
export function dopplerGeometry(m: DopplerModel, top: number): DopplerGeometry {
  const W = FIGURE_WIDTH;
  const n = m.fronts;
  const ahead = m.observers.some((o) => o.position === 'ahead');
  const behind = m.observers.some((o) => o.position === 'behind');
  const avail = W - 28 - (ahead ? OBS_ROOM : 0) - (behind ? OBS_ROOM : 0);
  const back = n * (1 + m.ratio);
  const fwd = n * Math.max(1 - m.ratio, 0);
  const lambda = Math.min((avail - ARROW_ROOM) / back, avail / (back + fwd), 112 / n);
  const fwdPx = Math.max(fwd * lambda, ARROW_ROOM);
  const slack = avail - back * lambda - fwdPx;
  // Laid out for a source moving right, then mirrored.
  const left = 14 + (behind ? OBS_ROOM : 0) + slack / 2;
  const xsR = left + back * lambda;
  const dir: 1 | -1 = m.direction === 'right' ? 1 : -1;
  const flip = (x: number): number => (dir === 1 ? x : W - x);
  const R = n * lambda;
  const yc = top + R + 4;
  const circles = Array.from({ length: n }, (_, i) => ({ cx: flip(xsR - (i + 1) * m.ratio * lambda), r: (i + 1) * lambda }));
  const observers = m.observers.map((o) => ({ label: o.label, position: o.position, x: flip(o.position === 'ahead' ? xsR + fwdPx + 20 : left - 20) }));
  return { lambda, xs: flip(xsR), yc, dir, circles, observers, top, bottom: yc + R + 4 };
}

export function renderDopplerWavefronts(r: Reader, uid: string = 'doppler'): Drawn {
  const m = dopplerModel(r);
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const g = dopplerGeometry(m, t.top);
  const tx = dopplerTexts(m);
  const notes: Notes = [];
  const color = SERIES_COLORS[0];
  const clip = `${uid}-dw`;
  const parts: string[] = [t.svg, `<defs><clipPath id="${clip}"><rect x="4" y="${n2(g.top)}" width="${W - 8}" height="${n2(g.bottom - g.top)}"/></clipPath></defs>`];
  const inside: string[] = [];
  for (const c of g.circles) inside.push(`<circle cx="${n2(c.cx)}" cy="${n2(g.yc)}" r="${n2(c.r)}" fill="none" stroke="${color}" stroke-width="1.5"/>`);
  if (m.emissionPoints) for (const c of g.circles) inside.push(`<circle cx="${n2(c.cx)}" cy="${n2(g.yc)}" r="1.9" fill="${MUTED}"/>`);
  const theta = m.ratio > 1 ? Math.asin(1 / m.ratio) : 0;
  const coneLen = m.ratio > 1 ? m.fronts * g.lambda * Math.sqrt(m.ratio * m.ratio - 1) + 12 : 0;
  if (m.shockCone) {
    // Each Mach line runs from the source back along the common tangent of the fronts, a little past the oldest.
    const len = coneLen;
    for (const s of [1, -1]) inside.push(seg(g.xs, g.yc, g.xs - g.dir * len * Math.cos(theta), g.yc - s * len * Math.sin(theta), INK, 2.2));
  }
  parts.push(`<g clip-path="url(#${clip})">${inside.join('')}</g>`);
  if (m.shockCone && tx.coneAngle) {
    // The angle between the line of motion (dashed, behind the source) and the upper Mach line.
    // The label sits INSIDE the wedge, just above the line of motion, as far back as it takes to fit under the Mach line.
    const ra = 30;
    const hh = tx.coneAngle === '?' ? 9.5 : 6;
    const hw = tx.coneAngle === '?' ? 10 : estWidth(tx.coneAngle, TICK_FS) / 2;
    const xd = Math.max(ra + hw + 6, (2 * hh + 11) / Math.tan(theta) + hw + 2);
    if (xd + hw > coneLen * Math.cos(theta)) notes.push({ code: 'crowded', message: 'coneAngle: the cone is too narrow for its angle label to fit inside it — draw more fronts or lower the speed ratio' });
    parts.push(seg(g.xs, g.yc, g.xs - g.dir * (xd + hw + 10), g.yc, MUTED, 1, '4 3'));
    const [a0, a1] = g.dir === 1 ? [Math.PI - theta, Math.PI] : [0, theta];
    parts.push(`<path d="${arcPath(g.xs, g.yc, ra, a0, a1)}" ${stroke(INK, 1.3)}/>`);
    parts.push(lab(g.xs - g.dir * xd, g.yc - hh - 4 + TICK_FS * 0.36, tx.coneAngle, 'middle', { halo: true, weight: 600 }));
  }
  // The velocity arrow, the source on top of it.
  parts.push(arrow(g.xs + g.dir * 6, g.yc, g.xs + g.dir * 42, g.yc, { width: 2.4, head: 9 }));
  if (tx.sourceSpeed) parts.push(lab(g.xs + g.dir * 26, g.yc - 9, tx.sourceSpeed, 'middle', { halo: true }));
  parts.push(`<circle cx="${n2(g.xs)}" cy="${n2(g.yc)}" r="6.4" fill="#ffffff"/><circle cx="${n2(g.xs)}" cy="${n2(g.yc)}" r="4.6" fill="${INK}"/>`);
  parts.push(text(g.xs, g.yc + 19, m.sourceLabel, { fs: 12, anchor: 'middle', weight: 700, halo: true }));
  for (const o of g.observers) {
    parts.push(`<rect x="${n2(o.x - 5.5)}" y="${n2(g.yc - 5.5)}" width="11" height="11" fill="#ffffff" stroke="${INK}" stroke-width="2"/>`);
    parts.push(text(o.x, g.yc + 21, o.label, { fs: 12, anchor: 'middle', weight: 700, halo: true }));
  }
  let y = g.bottom + 6;
  // The key: what the two marks are, then the values asked for.
  const kx = 16;
  y += TICK_FS;
  parts.push(`<circle cx="${n2(kx + 5)}" cy="${n2(y - 4)}" r="4.6" fill="${INK}"/>`, text(kx + 15, y, `source${g.observers.length ? '' : ' (moving as the arrow shows)'}`));
  if (g.observers.length) {
    const ox = kx + 15 + estWidth('source', TICK_FS) + 22;
    parts.push(`<rect x="${n2(ox)}" y="${n2(y - 9)}" width="10" height="10" fill="#ffffff" stroke="${INK}" stroke-width="2"/>`, text(ox + 16, y, `observer${g.observers.length > 1 ? 's' : ''} (at rest)`));
  }
  for (const k of tx.key) {
    y += TICK_FS + 6;
    parts.push(text(kx, y, k.value === '?' ? k.lead : `${k.lead} ${k.value}`));
    if (k.value === '?') parts.push(lab(kx + estWidth(k.lead, TICK_FS) * 0.9 + 4, y, '?', 'start'));
  }
  const gapAhead = (1 - m.ratio) * g.lambda;
  if (m.ratio > 0 && m.ratio < 1 && gapAhead < 3.5) notes.push({ code: 'crowded', message: `the fronts ahead of the source are drawn only ${numStr(gapAhead, 1)} units apart — they merge at 340 px; lower the speed ratio or draw fewer fronts` });
  return { body: parts.join(''), H: y + 10, facts: facts(notes) };
}
