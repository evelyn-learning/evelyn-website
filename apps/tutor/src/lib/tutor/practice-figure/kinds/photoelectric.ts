/**
 * photoelectric_setup — batch 5 (2026-10-16), two variants.
 *
 * variant 'tube' — the apparatus: light falling on a metal plate inside an
 * evacuated tube, a collector opposite, and outside the tube a microammeter
 * and a variable source connected so as to OPPOSE the electrons (the stopping
 * voltage).
 *   { variant: 'tube';
 *     frequency?: number;           // of the light, in units of 10¹⁴ Hz — OR
 *     wavelength?: number;          // … in nm (exactly one of the two)
 *     workFunction: number;         // of the plate, in eV
 *     metal?: string;               // "sodium" ⇒ the plate is labelled "sodium plate" (≤ 9 characters)
 *     showLight?: 'value' | 'blank' | 'none' ('value');           // "light, f = 7.5 × 10¹⁴ Hz" / "light, λ = 400 nm"
 *     showWorkFunction?: 'value' | 'blank' | 'none' ('value');    // "φ = 2.28 eV" under the plate's label
 *     showStoppingVoltage?: 'value' | 'blank' | 'none' ('none');  // "stopping voltage: 0.82 V" under the source
 *     showElectrons?: boolean (false);   // electrons crossing to the collector — refused when the light cannot eject any
 *     title?: string }
 *
 * variant 'graph' — maximum kinetic energy against frequency, drawn through
 * plot-frame: for each metal a straight line of slope h rising from its
 * threshold frequency.
 *   { variant: 'graph';
 *     metals: Array<{ workFunction?: number (eV); threshold?: number (10¹⁴ Hz); label?: string }>;   // 1–2, one of the two numbers each
 *     extend?: boolean (false);     // the dashed continuation of each line back to −φ on the energy axis
 *     fMax?: number; xStep?: number; yRange?: [min, max]; yStep?: number;
 *     xNumbers?: boolean (true); yNumbers?: boolean (true);       // false ⇒ an unnumbered, qualitative axis
 *     thresholdLabel?: 'value' | 'blank' | 'none' ('none');       // "f₀ = 5.51" where the line meets the frequency axis   ┐ one
 *     workFunctionLabel?: 'value' | 'blank' | 'none' ('none');    // "−2.28 eV" at the energy-axis intercept (needs extend) │ metal
 *     slopeLabel?: 'value' | 'blank' | 'none' ('none');           // "slope = 4.14 × 10⁻¹⁵ eV·s"                          ┘ only
 *     marks?: Array<{ frequency: number; label?: string; metal?: number }>;   // ≤ 3 dots ON a line (metal = 0-based index)
 *     title?: string }
 *
 * Physics: h = 4.136 × 10⁻¹⁵ eV·s, hc = 1240 eV·nm; KE_max = hf − φ.
 * Nothing that states an answer is printed unless asked.
 */
import { FIGURE_WIDTH, LABEL_FS, SERIES_COLORS, SERIES_DASHES, TICK_FS, buildFrame, buildLegend, estWidth, n2, niceBounds, type Frame, type LegendEntry } from '../plot-frame';
import type { Drawn, Reader } from '../spec';
import { INK, MUTED, arrow, text, titleBlock } from './draw';
import { facts, lab, numStr, seg, stroke, type Notes, type Show, SHOWS } from './draw2';

/** Planck's constant in eV·s per 10¹⁴ Hz: the photon energy in eV is this × the frequency in 10¹⁴ Hz. */
export const H14 = 0.4136;
/** hc in eV·nm. */
export const HC = 1240;

export interface PhotoTubeModel {
  variant: 'tube';
  lightBy: 'frequency' | 'wavelength';
  /** In 10¹⁴ Hz, or in nm. */
  light: number;
  /** eV. */
  photonEnergy: number;
  workFunction: number;
  /** hf − φ in eV (0 or less: no electrons). */
  keMax: number;
  metal?: string;
  showLight: Show;
  showWorkFunction: Show;
  showStoppingVoltage: Show;
  showElectrons: boolean;
  title?: string;
}
export interface PhotoMetal { workFunction: number; threshold: number; label: string }
export interface PhotoGraphModel {
  variant: 'graph';
  metals: PhotoMetal[];
  extend: boolean;
  xNumbers: boolean;
  yNumbers: boolean;
  thresholdLabel: Show;
  workFunctionLabel: Show;
  slopeLabel: Show;
  marks: Array<{ frequency: number; ke: number; metal: number; label?: string }>;
  xRange: [number, number];
  yRange: [number, number];
  xStep: number;
  yStep: number;
  title?: string;
}
export type PhotoModel = PhotoTubeModel | PhotoGraphModel;

export const X_LABEL = 'Frequency (× 10¹⁴ Hz)';
export const Y_LABEL = 'Maximum kinetic energy (eV)';

export function photoelectricModel(r: Reader): PhotoModel {
  const p = r.p;
  const show = (v: unknown, name: string, dflt: Show): Show => {
    if (v === undefined || v === null) return dflt;
    if (typeof v !== 'string' || !SHOWS.includes(v as Show)) r.fail(`${name} must be one of ${SHOWS.join(', ')}`);
    return v as Show;
  };
  const given = (v: unknown): boolean => v !== undefined && v !== null;
  if (p.variant !== 'tube' && p.variant !== 'graph') r.fail('variant must be one of tube, graph');
  const title = r.optStr(p.title, 'title', 160);
  if (p.variant === 'tube') {
    if (given(p.frequency) === given(p.wavelength)) r.fail('give exactly one of frequency (in 10¹⁴ Hz) and wavelength (in nm)');
    const lightBy = given(p.frequency) ? 'frequency' : 'wavelength';
    const light = r.positive(lightBy === 'frequency' ? p.frequency : p.wavelength, lightBy);
    if (lightBy === 'frequency' && light > 100) r.fail('frequency is in units of 10¹⁴ Hz (visible light is about 4 to 7.5)');
    if (lightBy === 'wavelength' && light < 10) r.fail('wavelength is in nm (visible light is about 400 to 750)');
    const photonEnergy = lightBy === 'frequency' ? H14 * light : HC / light;
    const workFunction = r.positive(p.workFunction, 'workFunction');
    const keMax = photonEnergy - workFunction;
    const showStoppingVoltage = show(p.showStoppingVoltage, 'showStoppingVoltage', 'none');
    const showElectrons = r.bool(p.showElectrons, 'showElectrons', false);
    const none = `the light (${numStr(photonEnergy, 2)} eV per photon) cannot eject electrons from a plate with a work function of ${numStr(workFunction, 2)} eV`;
    if (showElectrons && !(keMax > 0)) r.fail(`showElectrons: ${none}`);
    if (showStoppingVoltage === 'value' && !(keMax > 0)) r.fail(`showStoppingVoltage: ${none} — there is no stopping voltage to print`);
    return {
      variant: 'tube', lightBy, light, photonEnergy, workFunction, keMax, metal: r.optStr(p.metal, 'metal', 9),
      showLight: show(p.showLight, 'showLight', 'value'), showWorkFunction: show(p.showWorkFunction, 'showWorkFunction', 'value'), showStoppingVoltage, showElectrons, title,
    };
  }
  const metals = r.list(p.metals, 'metals', 1, 2).map((mv, i, all): PhotoMetal => {
    const o = r.obj(mv, `metals[${i}]`);
    if (given(o.workFunction) === given(o.threshold)) r.fail(`metals[${i}]: give exactly one of workFunction (eV) and threshold (10¹⁴ Hz)`);
    const workFunction = given(o.workFunction) ? r.positive(o.workFunction, `metals[${i}].workFunction`) : H14 * r.positive(o.threshold, `metals[${i}].threshold`);
    const threshold = given(o.threshold) ? (o.threshold as number) : workFunction / H14;
    return { workFunction, threshold, label: r.optStr(o.label, `metals[${i}].label`, 16) ?? (all.length > 1 ? `metal ${i + 1}` : '') };
  });
  if (metals.length === 2 && metals[0].label === metals[1].label) r.fail(`metals: both are labelled "${metals[0].label}"`);
  if (metals.length === 2 && Math.abs(metals[0].threshold - metals[1].threshold) < 1e-9) r.fail('metals: the two lines would coincide (same threshold)');
  const extend = r.bool(p.extend, 'extend', false);
  const thresholdLabel = show(p.thresholdLabel, 'thresholdLabel', 'none');
  const workFunctionLabel = show(p.workFunctionLabel, 'workFunctionLabel', 'none');
  const slopeLabel = show(p.slopeLabel, 'slopeLabel', 'none');
  for (const [name, v] of [['thresholdLabel', thresholdLabel], ['workFunctionLabel', workFunctionLabel], ['slopeLabel', slopeLabel]] as const) {
    if (v !== 'none' && metals.length > 1) r.fail(`${name} is for a graph of one metal — with two lines, read the values off the numbered axes`);
  }
  if (workFunctionLabel !== 'none' && !extend) r.fail('workFunctionLabel needs extend: true (the label sits where the dashed line meets the energy axis)');
  const fLo = Math.min(...metals.map((m) => m.threshold));
  const fHi = Math.max(...metals.map((m) => m.threshold));
  const xb = niceBounds(0, fHi * 2, 6);
  const fMax = r.optNum(p.fMax, 'fMax') ?? xb.max;
  if (!(fMax >= fHi * 1.25)) r.fail(`fMax (${numStr(fMax, 2)}) leaves no line to see — the threshold is at ${numStr(fHi, 2)} × 10¹⁴ Hz`);
  const keTop = H14 * (fMax - fLo);
  const phiMax = Math.max(...metals.map((m) => m.workFunction));
  const yb = niceBounds(extend ? -phiMax * 1.18 : 0, keTop, 6);
  const yRange = r.optRange(p.yRange, 'yRange') ?? [yb.min, yb.max];
  if (yRange[0] > 0 || (extend && yRange[0] > -phiMax)) r.fail(`yRange must start at ${extend ? `−${numStr(phiMax, 2)} or below (the dashed line ends there)` : '0 or below'}`);
  if (yRange[1] < keTop * 0.5) r.fail('yRange cuts off more than half of the line — raise its top or lower fMax');
  const marks = (given(p.marks) ? r.list(p.marks, 'marks', 0, 3) : []).map((mv, i) => {
    const o = r.obj(mv, `marks[${i}]`);
    const metal = r.optNum(o.metal, `marks[${i}].metal`) ?? 0;
    if (!Number.isInteger(metal) || metal < 0 || metal >= metals.length) r.fail(`marks[${i}].metal must be the 0-based index of a metal (0 to ${metals.length - 1})`);
    const frequency = r.num(o.frequency, `marks[${i}].frequency`);
    if (frequency < metals[metal].threshold - 1e-9 || frequency > fMax) r.fail(`marks[${i}].frequency (${frequency}) is not on the line (${numStr(metals[metal].threshold, 2)} to ${numStr(fMax, 2)})`);
    const ke = H14 * (frequency - metals[metal].threshold);
    if (ke > yRange[1]) r.fail(`marks[${i}] is above the top of yRange`);
    return { frequency, ke, metal, label: r.optStr(o.label, `marks[${i}].label`, 4) };
  });
  return {
    variant: 'graph', metals, extend, xNumbers: r.bool(p.xNumbers, 'xNumbers', true), yNumbers: r.bool(p.yNumbers, 'yNumbers', true), thresholdLabel, workFunctionLabel, slopeLabel, marks,
    xRange: [0, fMax], yRange, xStep: r.optStep(p.xStep, 'xStep') ?? xb.step, yStep: r.optStep(p.yStep, 'yStep') ?? yb.step, title,
  };
}

/** What the tube prints, as lead + value pairs (value "?" = a blank box, '' = not printed). */
export function tubeTexts(m: PhotoTubeModel): { light: { lead: string; value: string }; plate: string; workFunction: { lead: string; value: string }; voltage: { lead: string; value: string } } {
  const v = (s: Show, value: string): string => (s === 'value' ? value : s === 'blank' ? '?' : '');
  const lightValue = v(m.showLight, m.lightBy === 'frequency' ? `${numStr(m.light, 3)} × 10¹⁴ Hz` : `${numStr(m.light, 1)} nm`);
  const volts = v(m.showStoppingVoltage, `${numStr(Math.max(m.keMax, 0), 2)} V`);
  return {
    light: { lead: lightValue ? `light, ${m.lightBy === 'frequency' ? 'f' : 'λ'} =` : 'light', value: lightValue },
    plate: `${m.metal ?? 'metal'} plate`,
    workFunction: { lead: 'φ =', value: v(m.showWorkFunction, `${numStr(m.workFunction, 2)} eV`) },
    voltage: { lead: volts ? 'stopping voltage:' : 'variable voltage', value: volts },
  };
}

/** What the graph's three optional labels print ('' = not printed; "?" = a blank box after the lead). */
export function graphTexts(m: PhotoGraphModel): { threshold: { lead: string; value: string }; workFunction: string; slope: { lead: string; value: string } } {
  const v = (s: Show, value: string): string => (s === 'value' ? value : s === 'blank' ? '?' : '');
  return {
    threshold: { lead: 'f₀ =', value: v(m.thresholdLabel, numStr(m.metals[0].threshold, 2)) },
    workFunction: v(m.workFunctionLabel, `−${numStr(m.metals[0].workFunction, 2)} eV`),
    slope: { lead: 'slope =', value: v(m.slopeLabel, `${numStr(H14 * 10, 2)} × 10⁻¹⁵ eV·s`) },
  };
}

/** `lead value` starting at x; a "?" value is the dashed box. Returns the markup. */
function leadValue(x: number, y: number, lead: string, value: string, anchor: 'start' | 'end' | 'middle' = 'start', halo = false): string {
  if (!value) return text(x, y, lead, { anchor, halo });
  if (value !== '?') return text(x, y, `${lead} ${value}`, { anchor, halo });
  // Nine tenths of the layout estimate — the measure the legibility report uses — so the box sits close without touching.
  const lw = estWidth(lead, TICK_FS) * 0.9 + 4;
  const w = lw + 20;
  const x0 = anchor === 'start' ? x : anchor === 'end' ? x - w : x - w / 2;
  return text(x0, y, lead, { halo }) + lab(x0 + lw, y, '?', 'start');
}

function renderTube(m: PhotoTubeModel): Drawn {
  const W = FIGURE_WIDTH;
  const t = titleBlock(m.title, W);
  const tx = tubeTexts(m);
  const notes: Notes = [];
  const parts: string[] = [t.svg];
  const [x0, x1] = [76, 306];
  const ty = t.top + 54;
  const th = 72;
  const yC = ty + th + 60;
  const plateX = 104;
  const collX = 272;
  // The circuit first (the tube and the plates are drawn over the wire ends).
  parts.push(`<path d="M${plateX + 3},${n2(ty + 60)}V${n2(yC)}H147M173,${n2(yC)}H216M224,${n2(yC)}H${collX + 1.5}V${n2(ty + 60)}" ${stroke(INK, 1.6)}/>`);
  // The tube: glass, drawn as a double outline.
  parts.push(`<rect x="${x0}" y="${n2(ty)}" width="${x1 - x0}" height="${th}" rx="24" fill="#ffffff" stroke="${INK}" stroke-width="1.8"/>`);
  parts.push(`<path d="M${plateX + 3},${n2(ty + 60)}V${n2(ty + th)}M${collX + 1.5},${n2(ty + 60)}V${n2(ty + th)}" ${stroke(INK, 1.6)}/>`);
  parts.push(`<rect x="${plateX}" y="${n2(ty + 12)}" width="6" height="48" fill="${INK}"/>`);
  parts.push(`<rect x="${collX}" y="${n2(ty + 12)}" width="3" height="48" fill="${INK}"/>`);
  parts.push(text(x1, ty - 7, 'evacuated tube', { anchor: 'end', fill: MUTED }));
  // The light: three parallel rays onto the face of the plate that looks at the collector.
  const light = SERIES_COLORS[1];
  for (const dy of [22, 36, 50]) parts.push(arrow(plateX + 7 + 42, ty + dy - 56, plateX + 7, ty + dy, { color: light, width: 1.8, head: 8 }));
  parts.push(leadValue(164, t.top + 20, tx.light.lead, tx.light.value));
  if (m.showElectrons) {
    for (const [ex, ey] of [[138, 47], [172, 28], [206, 50]] as const) {
      parts.push(arrow(ex + 4, ty + ey, ex + 26, ty + ey, { width: 1.3, head: 6 }), `<circle cx="${ex}" cy="${n2(ty + ey)}" r="3.2" fill="${INK}"/>`);
    }
    parts.push(text(236, ty + 33, 'electrons', { anchor: 'middle' }));
  }
  // Labels under the tube, each beside its own lead.
  const ly = ty + th + 17;
  parts.push(text(plateX - 4, ly, tx.plate, { anchor: 'end' }));
  if (tx.workFunction.value) parts.push(leadValue(plateX - 4, ly + 15, tx.workFunction.lead, tx.workFunction.value, 'end'));
  parts.push(text(collX + 9, ly, 'collector'));
  // The microammeter and the variable source (its + plate towards the metal plate: the collector is made negative).
  parts.push(`<circle cx="160" cy="${n2(yC)}" r="13" fill="#ffffff" stroke="${INK}" stroke-width="1.6"/>`, text(160, yC + 4, 'µA', { anchor: 'middle', weight: 600 }));
  parts.push(seg(216, yC - 12, 216, yC + 12, INK, 1.6), seg(224, yC - 6.5, 224, yC + 6.5, INK, 3.4));
  parts.push(arrow(204, yC + 15, 238, yC - 17, { width: 1.3, head: 7 }));
  parts.push(text(207, yC - 8, '+', { fs: 12, anchor: 'middle', weight: 600 }), text(233, yC + 15, '−', { fs: 12, anchor: 'middle', weight: 600 }));
  parts.push(leadValue(220, yC + 36, tx.voltage.lead, tx.voltage.value, 'middle'));
  return { body: parts.join(''), H: yC + 46, facts: facts(notes) };
}

function renderGraph(m: PhotoGraphModel, uid: string): Drawn {
  const notes: Notes = [];
  const f: Frame = buildFrame({
    xRange: m.xRange, yRange: m.yRange, xStep: m.xStep, yStep: m.yStep, xLabel: m.xNumbers ? X_LABEL : 'Frequency', yLabel: m.yNumbers ? Y_LABEL : 'Maximum kinetic energy',
    title: m.title, xNumbers: m.xNumbers, yNumbers: m.yNumbers, aspect: 0.8, zeroAxes: true,
  });
  const tx = graphTexts(m);
  const clip = `${uid}-pe`;
  const parts: string[] = [f.svg, `<defs><clipPath id="${clip}"><rect x="${n2(f.plot.x)}" y="${n2(f.plot.y)}" width="${n2(f.plot.w)}" height="${n2(f.plot.h)}"/></clipPath></defs>`];
  const fMax = m.xRange[1];
  const lines: string[] = [];
  // An unnumbered frame draws no zero line of its own: the frequency axis (KE = 0) is drawn here when it is not the bottom border.
  if (m.yRange[0] < 0 && !m.yNumbers) lines.push(seg(f.plot.x, f.Y(0), f.plot.x + f.plot.w, f.Y(0), INK, 1.4));
  m.metals.forEach((mt, i) => {
    const color = SERIES_COLORS[i];
    if (m.extend) lines.push(`<path d="M${n2(f.X(0))},${n2(f.Y(-mt.workFunction))}L${n2(f.X(mt.threshold))},${n2(f.Y(0))}" ${stroke(color, 1.3, '3 3')}/>`);
    lines.push(`<path d="M${n2(f.X(mt.threshold))},${n2(f.Y(0))}L${n2(f.X(fMax))},${n2(f.Y(H14 * (fMax - mt.threshold)))}" ${stroke(color, 2.4, SERIES_DASHES[i] || undefined)}/>`);
  });
  parts.push(`<g clip-path="url(#${clip})">${lines.join('')}</g>`);
  const dot = (cx: number, cy: number): string => `<circle cx="${n2(cx)}" cy="${n2(cy)}" r="5.9" fill="#ffffff"/><circle cx="${n2(cx)}" cy="${n2(cy)}" r="3.8" fill="${INK}"/>`;
  const m0 = m.metals[0];
  if (tx.threshold.value) {
    const px = f.X(m0.threshold);
    const py = f.Y(0);
    parts.push(dot(px, py));
    const w = estWidth(tx.threshold.value === '?' ? `${tx.threshold.lead} ???` : `${tx.threshold.lead} ${tx.threshold.value}`, TICK_FS);
    if (m.extend) parts.push(leadValue(px + 9, py + 17, tx.threshold.lead, tx.threshold.value, 'start', true));
    else {
      if (px - 9 - w < f.plot.x + 2) notes.push({ code: 'crowded', message: 'thresholdLabel: there is no room left of the threshold for its label — raise fMax less, or use extend: true (the label then sits under the axis)' });
      parts.push(leadValue(px - 9, py - 9, tx.threshold.lead, tx.threshold.value, 'end', true));
    }
  }
  if (tx.workFunction) {
    const py = f.Y(-m0.workFunction);
    parts.push(dot(f.X(0), py), lab(f.X(0) + 10, py + 15, tx.workFunction, 'start', { halo: true }));
    if (py + 20 > f.plot.y + f.plot.h) notes.push({ code: 'crowded', message: 'workFunctionLabel: no room under the intercept — lower the bottom of yRange' });
  }
  if (tx.slope.value) {
    const xr = f.plot.x + f.plot.w - 8;
    const yb = f.plot.y + f.plot.h - 9;
    const wide = estWidth(tx.slope.value === '?' ? 'slope = ???' : tx.slope.value, TICK_FS);
    // The label sits in the corner under the line: the line must be clear of it where the label starts.
    const lineY = f.Y(H14 * Math.max(0, m.xRange[0] + ((xr - wide - f.plot.x) / f.plot.w) * (fMax - m.xRange[0]) - m0.threshold));
    if (lineY > yb - (tx.slope.value === '?' ? 16 : 30)) notes.push({ code: 'crowded', message: 'slopeLabel: the line runs through the corner where the slope label sits — raise fMax' });
    if (tx.slope.value === '?') parts.push(leadValue(xr, yb, tx.slope.lead, '?', 'end', true));
    else parts.push(text(xr, yb - TICK_FS - 3, tx.slope.lead, { anchor: 'end', halo: true }), text(xr, yb, tx.slope.value, { anchor: 'end', halo: true }));
  }
  const marks: Array<{ what: string; cx: number; cy: number }> = [];
  m.marks.forEach((mk, i) => {
    const cx = f.X(mk.frequency);
    const cy = f.Y(mk.ke);
    parts.push(dot(cx, cy));
    marks.push({ what: `marks[${i}]`, cx, cy });
    if (mk.label) parts.push(text(cx - 8, cy - 7, mk.label, { fs: LABEL_FS, anchor: 'end', weight: 700, halo: true }));
  });
  let bottom = f.bottom;
  if (m.metals.length > 1) {
    const entries: LegendEntry[] = m.metals.map((mt, i) => ({ label: mt.label, color: SERIES_COLORS[i], dash: SERIES_DASHES[i] || undefined }));
    const lg = buildLegend(entries, bottom + 2);
    parts.push(lg.svg);
    bottom += 2 + lg.height;
  }
  return { body: parts.join(''), H: bottom, facts: { curveCount: m.metals.length, marks, curves: [], notes, plot: f.plot } };
}

export function renderPhotoelectricSetup(r: Reader, uid: string = 'photo'): Drawn {
  const m = photoelectricModel(r);
  return m.variant === 'tube' ? renderTube(m) : renderGraph(m, uid);
}
