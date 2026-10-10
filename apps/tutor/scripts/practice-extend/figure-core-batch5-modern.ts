/**
 * Batch 5, part "modern" (doppler_wavefronts, photoelectric_setup: tube and
 * graph): the TEXT transcription and the deterministic checkers. Conventions:
 * figure-core-batch4-kit.ts.
 *
 * What a figure SETTLES: a printed value; for the photoelectric graph, a value
 * read off numbered axes (on a gridline or halfway between two); who is ahead
 * of the source and who is behind. A value hidden behind a "?" — or simply
 * not printed — is never used: the checker refuses, or takes it as an
 * argument the question must then state.
 *
 * Units: frequencies of light in 10¹⁴ Hz, wavelengths of light in nm,
 * energies in eV, voltages in V; h = 4.136 × 10⁻¹⁵ eV·s, hc = 1240 eV·nm.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { dopplerModel, dopplerTexts, machAngle, type DopplerModel } from '../../src/lib/tutor/practice-figure/kinds/doppler';
import { H14, HC, X_LABEL, Y_LABEL, graphTexts, photoelectricModel, tubeTexts, type PhotoGraphModel, type PhotoMetal, type PhotoTubeModel } from '../../src/lib/tutor/practice-figure/kinds/photoelectric';
import type { Derived } from './figure-core';
import { BLANK, approx, argIndex, argNum, argStr, fail, fmt, label, modelOf, num, shown, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

const onHalfStep = (v: number, step: number): boolean => Math.abs(v / (step / 2) - Math.round(v / (step / 2))) < 1e-6;
/** A computed physical value: exact when it comes out to two decimals or fewer; otherwise a rounded value
 *  (a key then matches when it is the value rounded to the key's own decimals — "3.10" for 3.102). */
const calc = (v: number): Derived => (Math.abs(v * 100 - Math.round(v * 100)) < 1e-6 ? num(Math.round(v * 100) / 100) : approx(v));
const leadValue = (lead: string, value: string): string => (value === '?' ? `"${lead}" ${BLANK}` : `"${lead} ${value}"`);
function positive(a: P, k: string): number {
  const v = argNum(a, k);
  return v > 0 ? v : fail(`derivation argument "${k}" must be greater than 0`);
}

// ── doppler_wavefronts ──────────────────────────────────────────────────────

function describeDoppler(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  const m = modelOf(spec, dopplerModel);
  const tx = dopplerTexts(m);
  const fwd = m.direction;
  const back = m.direction === 'right' ? 'left' : 'right';
  printed.push(`source label: "${m.sourceLabel}"`);
  out.push(`A view from above of a wave source — a filled dot labelled "${m.sourceLabel}" — with the ${m.fronts} circular wavefronts it has emitted. A heavy arrow from the source points to the ${fwd}: the direction it is moving.`);
  if (m.ratio === 0) out.push('  The fronts are concentric circles, evenly spaced, centred on the source.');
  else if (m.ratio < 1) out.push(`  The fronts are not concentric: every front encloses the source, and they are closer together on the ${fwd} of the source (ahead of it) than on the ${back} (behind it).`);
  else if (m.ratio === 1) out.push(`  Every front passes through the source itself: the fronts all touch there and spread out to the ${back}, behind it.`);
  else out.push(`  The source is outside every front: the fronts lie to the ${back} of it (behind it), the smallest nearest to it, each larger one further back, overlapping.`);
  if (m.emissionPoints) out.push('  A small dot marks the centre of each front, in a row behind the source.');
  if (tx.sourceSpeed) {
    printed.push(`arrow label: ${shown(tx.sourceSpeed)}`);
    out.push(`  The arrow is labelled ${shown(tx.sourceSpeed)}.`);
  }
  if (m.shockCone) {
    out.push('  Two heavy straight lines run back from the source, one on each side, touching every front: the edges of a cone.');
    if (tx.coneAngle) {
      printed.push(`cone angle label: ${shown(tx.coneAngle)}`);
      out.push(`  The angle between the dashed line of motion behind the source and one edge of the cone is marked with an arc, labelled ${shown(tx.coneAngle)}.`);
    }
  }
  for (const o of m.observers) {
    printed.push(`observer label: "${o.label}"`);
    out.push(`  An open square labelled "${o.label}" — an observer at rest — is on the line of motion to the ${o.position === 'ahead' ? fwd : back} of the source: ${o.position === 'ahead' ? 'the source is moving towards it' : 'the source is moving away from it'}.`);
  }
  for (const k of tx.key) {
    printed.push(`key line: ${leadValue(k.lead, k.value)}`);
    out.push(`  Under the figure: ${leadValue(k.lead, k.value)}.`);
  }
  return 'a wavefront diagram of a moving source';
}

const NOT_SETTLED = 'the figure does not print it — give it as a derivation argument (the question must then state it)';
/** The wave speed, the source speed and their ratio, as far as the figure (or the arguments) settle them. */
function speedsOf(m: DopplerModel, a: P): { v?: number; vs?: number; ratio?: number } {
  const v = a.waveSpeed !== undefined ? positive(a, 'waveSpeed') : m.showWaveSpeed === 'value' ? m.waveSpeed : undefined;
  const vs = a.sourceSpeed !== undefined ? argNum(a, 'sourceSpeed') : m.showSourceSpeed === 'value' ? m.sourceSpeed : undefined;
  if (vs !== undefined && vs < 0) return fail('derivation argument "sourceSpeed" must be 0 or more');
  const ratio = v !== undefined && vs !== undefined ? vs / v : a.speedRatio !== undefined ? argNum(a, 'speedRatio') : m.showRatio === 'value' || m.coneAngle === 'value' ? m.ratio : undefined;
  return { v, vs, ratio };
}
const ratioOf = (m: DopplerModel, a: P): number => speedsOf(m, a).ratio ?? fail(`the ratio of the source speed to the wave speed: ${NOT_SETTLED} — "waveSpeed" and "sourceSpeed", or "speedRatio"`);
const waveSpeedOf = (m: DopplerModel, a: P): number => speedsOf(m, a).v ?? fail(`the wave speed: ${m.showWaveSpeed === 'blank' ? 'it is hidden behind a "?"; ' : ''}${NOT_SETTLED} — "waveSpeed"`);
const frequencyOf = (m: DopplerModel, a: P): number => (a.frequency !== undefined ? positive(a, 'frequency') : m.showFrequency === 'value' ? (m.frequency as number) : fail(`the source frequency: ${m.showFrequency === 'blank' ? 'it is hidden behind a "?"; ' : ''}${NOT_SETTLED} — "frequency"`));
function sideOf(m: DopplerModel, a: P): 'ahead' | 'behind' {
  const name = argStr(a, 'observer');
  const o = m.observers.find((x) => x.label === name);
  return o ? o.position : fail(`derivation argument "observer" must be the label of an observer on the figure (${m.observers.map((x) => `"${x.label}"`).join(', ') || 'it has none'})`);
}
const AHEAD_SUPERSONIC = 'the source is at least as fast as the wave: no wavefront has reached a point ahead of it — there is no frequency or wavelength there';

const dopplerCheckers: Record<string, Batch4CheckerDef> = {
  doppler_observed_frequency: {
    kinds: ['doppler_wavefronts'], args: '{ observer: string, frequency?: number, waveSpeed?: number, sourceSpeed?: number, speedRatio?: number }',
    returns: 'the frequency the named observer (at rest) receives: f·v/(v − vₛ) ahead of the source, f·v/(v + vₛ) behind it — from the printed frequency and speeds (or ratio); a value the figure hides must be given as an argument',
    run: (s, a) => {
      const m = modelOf(s, dopplerModel);
      const side = sideOf(m, a);
      const r = ratioOf(m, a);
      if (side === 'ahead' && r >= 1) return fail(AHEAD_SUPERSONIC);
      return calc(frequencyOf(m, a) / (side === 'ahead' ? 1 - r : 1 + r));
    },
  },
  doppler_wavelength: {
    kinds: ['doppler_wavefronts'], args: '{ observer: string, frequency?: number, waveSpeed?: number, sourceSpeed?: number }',
    returns: 'the distance between wavefronts on the named observer\'s side: (v − vₛ)/f ahead, (v + vₛ)/f behind — needs both speeds and the source frequency (printed, or given as arguments)',
    run: (s, a) => {
      const m = modelOf(s, dopplerModel);
      const side = sideOf(m, a);
      const v = waveSpeedOf(m, a);
      const vs = speedsOf(m, a).vs ?? fail(`the source speed: ${m.showSourceSpeed === 'blank' ? 'it is hidden behind a "?"; ' : ''}${NOT_SETTLED} — "sourceSpeed"`);
      if (side === 'ahead' && vs >= v) return fail(AHEAD_SUPERSONIC);
      return calc((side === 'ahead' ? v - vs : v + vs) / frequencyOf(m, a));
    },
  },
  doppler_source_speed: {
    kinds: ['doppler_wavefronts'], args: '{ observer: string, observedFrequency: number, frequency?: number, waveSpeed?: number }',
    returns: 'the speed of the source from the frequency the named observer receives: v·(1 − f/f′) for the observer ahead, v·(f/f′ − 1) for the one behind (the observed frequency is an argument the question states)',
    run: (s, a) => {
      const m = modelOf(s, dopplerModel);
      const side = sideOf(m, a);
      const v = waveSpeedOf(m, a);
      const q = frequencyOf(m, a) / positive(a, 'observedFrequency');
      const vs = side === 'ahead' ? v * (1 - q) : v * (q - 1);
      return vs >= 0 ? calc(vs) : fail(`an observer ${side === 'ahead' ? 'ahead of the source receives a HIGHER' : 'behind the source receives a LOWER'} frequency than the source emits — "observedFrequency" does not fit`);
    },
  },
  doppler_higher_frequency: {
    kinds: ['doppler_wavefronts'], args: '{}',
    returns: 'the label of the observer who receives the higher frequency — the one the source is moving towards (needs an observer on each side and a source slower than the wave)',
    run: (s) => {
      const m = modelOf(s, dopplerModel);
      const ahead = m.observers.find((o) => o.position === 'ahead');
      if (!ahead || m.observers.length < 2) return fail('the figure needs an observer ahead of the source and one behind it');
      if (m.ratio === 0) return fail('the source is not moving: both observers receive the same frequency');
      if (m.ratio >= 1) return fail(AHEAD_SUPERSONIC);
      return label(ahead.label);
    },
  },
  doppler_mach_number: {
    kinds: ['doppler_wavefronts'], args: '{ waveSpeed?: number, sourceSpeed?: number }',
    returns: 'source speed ÷ wave speed — from the two printed speeds, the printed ratio, or the printed cone angle (1 ÷ sin θ); refused when the figure prints none of them',
    run: (s, a) => calc(ratioOf(modelOf(s, dopplerModel), a)),
  },
  doppler_cone_angle: {
    kinds: ['doppler_wavefronts'], args: '{ waveSpeed?: number, sourceSpeed?: number, speedRatio?: number }',
    returns: 'the half-angle of the shock cone in degrees, sin θ = v ÷ vₛ — from the printed speeds or ratio (or the arguments); only for a source faster than the wave',
    run: (s, a) => {
      const r = ratioOf(modelOf(s, dopplerModel), a);
      return r > 1 ? calc(machAngle(r)) : fail('there is a cone only when the source is faster than the wave');
    },
  },
};

// ── photoelectric_setup ─────────────────────────────────────────────────────

function describePhoto(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  const m = modelOf(spec, photoelectricModel);
  if (m.variant === 'tube') {
    const tx = tubeTexts(m);
    out.push('A photoelectric tube: inside a sealed glass tube labelled "evacuated tube", a thick plate on the left faces a thin collector plate on the right. Three parallel arrows of light slant down onto the face of the thick plate.');
    printed.push(`light label: ${tx.light.value ? leadValue(tx.light.lead, tx.light.value) : '"light"'}`);
    out.push(`  The light is labelled ${tx.light.value ? leadValue(tx.light.lead, tx.light.value) : '"light" (no frequency or wavelength is given)'}.`);
    printed.push(`plate label: "${tx.plate}"`, 'collector label: "collector"');
    out.push(`  The thick plate is labelled "${tx.plate}"; the thin one "collector".`);
    if (tx.workFunction.value) {
      printed.push(`work function label: ${leadValue(tx.workFunction.lead, tx.workFunction.value)}`);
      out.push(`  Under the plate's label: ${leadValue(tx.workFunction.lead, tx.workFunction.value)} (its work function).`);
    }
    out.push(m.showElectrons ? '  Three dots with short arrows, labelled "electrons", cross the tube from the plate towards the collector.' : '  No electrons are drawn.');
    if (m.showElectrons) printed.push('word: "electrons"');
    printed.push('meter label: "µA"');
    out.push('  Outside the tube a wire joins the two plates through a meter marked "µA" (a microammeter) and a variable source (a cell symbol with an arrow through it) whose "+" side is towards the metal plate and "−" side towards the collector.');
    printed.push(`source label: ${tx.voltage.value ? leadValue(tx.voltage.lead, tx.voltage.value) : `"${tx.voltage.lead}"`}`);
    out.push(`  The source is labelled ${tx.voltage.value ? leadValue(tx.voltage.lead, tx.voltage.value) : `"${tx.voltage.lead}"`}.`);
    return 'a diagram of a photoelectric tube';
  }
  const tx = graphTexts(m);
  const xl = m.xNumbers ? X_LABEL : 'Frequency';
  const yl = m.yNumbers ? Y_LABEL : 'Maximum kinetic energy';
  printed.push(`x-axis label: "${xl}"`, `y-axis label: "${yl}"`);
  out.push(`A graph of "${yl}" (vertical) against "${xl}" (horizontal)${m.xNumbers ? `, the frequency axis numbered from 0 to ${fmt(m.xRange[1])} in steps of ${fmt(m.xStep)}` : ', the frequency axis not numbered'}${m.yNumbers ? `, the energy axis from ${fmt(m.yRange[0])} to ${fmt(m.yRange[1])} in steps of ${fmt(m.yStep)}` : ', the energy axis not numbered'}.`);
  m.metals.forEach((mt, i) => {
    const style = i === 0 ? 'solid' : 'dashed';
    if (m.metals.length > 1) printed.push(`legend entry: "${mt.label}"`);
    const where = m.xNumbers && onHalfStep(mt.threshold, m.xStep) ? ` at ${fmt(mt.threshold)}` : '';
    const bits = [`A straight ${style} line${m.metals.length > 1 ? ` (legend: "${mt.label}")` : ''} rises to the right from a point on the frequency axis${where}`];
    if (m.extend) bits.push(`thin dashes continue it down and to the left to the energy axis${m.yNumbers && onHalfStep(mt.workFunction, m.yStep) ? `, which it meets at ${fmt(-mt.workFunction)}` : ', which it meets below zero'}`);
    out.push(`  ${bits.join('; ')}.`);
  });
  if (m.metals.length > 1) out.push('  The two lines are parallel.');
  if (tx.threshold.value) {
    printed.push(`threshold label: ${leadValue(tx.threshold.lead, tx.threshold.value)}`);
    out.push(`  A dot where the line meets the frequency axis is labelled ${leadValue(tx.threshold.lead, tx.threshold.value)}.`);
  }
  if (tx.workFunction) {
    printed.push(`intercept label: ${shown(tx.workFunction)}`);
    out.push(`  A dot where the dashes meet the energy axis is labelled ${shown(tx.workFunction)}.`);
  }
  if (tx.slope.value) {
    printed.push(`slope label: ${leadValue(tx.slope.lead, tx.slope.value)}`);
    out.push(`  In the corner under the line: ${leadValue(tx.slope.lead, tx.slope.value)}.`);
  }
  m.marks.forEach((mk) => {
    if (mk.label) printed.push(`point label: "${mk.label}"`);
    const at = m.xNumbers && onHalfStep(mk.frequency, m.xStep) ? ` at frequency ${fmt(mk.frequency)}` : '';
    out.push(`  A dot${mk.label ? ` lettered "${mk.label}"` : ''} is on the ${m.metals.length > 1 ? `${mk.metal === 0 ? 'solid' : 'dashed'} line` : 'line'}${at}.`);
  });
  return 'a graph of maximum kinetic energy against frequency for the photoelectric effect';
}

function graph(spec: PracticeFigureSpec): PhotoGraphModel {
  const m = modelOf(spec, photoelectricModel);
  return m.variant === 'graph' ? m : fail('this checker is for the graph variant, not the tube');
}
/** The photon energy in eV from the arguments, or (tube) from the printed light. */
function photonEnergy(m: PhotoTubeModel | PhotoGraphModel, a: P): number {
  if (a.frequency !== undefined && a.wavelength !== undefined) return fail('give "frequency" (10¹⁴ Hz) or "wavelength" (nm), not both');
  if (a.frequency !== undefined) return H14 * positive(a, 'frequency');
  if (a.wavelength !== undefined) return HC / positive(a, 'wavelength');
  if (m.variant === 'graph') return fail('give the light as the derivation argument "frequency" (in 10¹⁴ Hz) or "wavelength" (in nm) — the question must state it');
  if (m.showLight === 'value') return m.photonEnergy;
  return fail(`the ${m.lightBy} of the light is ${m.showLight === 'blank' ? 'hidden behind a "?"' : 'not printed'} — give it as the derivation argument "frequency" (10¹⁴ Hz) or "wavelength" (nm)`);
}
function metalOf(m: PhotoGraphModel, a: P): PhotoMetal {
  return m.metals[argIndex(a, 'metal', m.metals.length, 'metal of the graph (solid line = 0)')];
}
/** The work function in eV, when the figure (or an argument) settles it. */
function workFunction(m: PhotoTubeModel | PhotoGraphModel, a: P): number {
  if (a.workFunction !== undefined) return positive(a, 'workFunction');
  if (m.variant === 'tube') {
    if (m.showWorkFunction === 'value') return m.workFunction;
    if (a.stoppingVoltage !== undefined || a.keMax !== undefined) {
      const ke = positive(a, a.stoppingVoltage !== undefined ? 'stoppingVoltage' : 'keMax');
      const phi = photonEnergy(m, a) - ke;
      return phi > 0 ? phi : fail('the stopping voltage is larger than the photon energy allows');
    }
    return fail(`the work function is ${m.showWorkFunction === 'blank' ? 'hidden behind a "?"' : 'not printed'} — give "workFunction", or the measured "stoppingVoltage" (or "keMax"), as a derivation argument`);
  }
  const mt = metalOf(m, a);
  const first = mt === m.metals[0];
  if (first && (m.thresholdLabel === 'value' || m.workFunctionLabel === 'value')) return mt.workFunction;
  if (m.xNumbers && onHalfStep(mt.threshold, m.xStep)) return mt.workFunction;
  if (m.extend && m.yNumbers && onHalfStep(mt.workFunction, m.yStep)) return mt.workFunction;
  return fail(`the graph does not settle the work function: ${!m.xNumbers ? 'its frequency axis is not numbered' : 'the line does not leave the frequency axis on a gridline (or halfway between two)'}${first && (m.thresholdLabel === 'blank' || m.workFunctionLabel === 'blank') ? ' and the label is a "?"' : ''} — give "workFunction" as a derivation argument`);
}
function keMax(m: PhotoTubeModel | PhotoGraphModel, a: P): number {
  if (m.variant === 'tube' && a.stoppingVoltage !== undefined) return positive(a, 'stoppingVoltage');
  if (m.variant === 'tube' && m.showStoppingVoltage === 'value' && a.frequency === undefined && a.wavelength === undefined && a.workFunction === undefined) return Number(Math.max(m.keMax, 0).toFixed(2));
  const ke = photonEnergy(m, a) - workFunction(m, a);
  return ke > 0 ? ke : fail('a photon of this light has less energy than the work function: no electrons are emitted, so there is no kinetic energy or stopping voltage');
}

const photoCheckers: Record<string, Batch4CheckerDef> = {
  photo_photon_energy: {
    kinds: ['photoelectric_setup'], args: '{ frequency?: number (10¹⁴ Hz), wavelength?: number (nm) }',
    returns: 'the energy of one photon in eV: hf (h = 4.136 × 10⁻¹⁵ eV·s) or hc/λ (hc = 1240 eV·nm) — from the light printed on the tube, or from the argument',
    run: (s, a) => calc(photonEnergy(modelOf(s, photoelectricModel), a)),
  },
  photo_ke_max: {
    kinds: ['photoelectric_setup'], args: '{ frequency?: number, wavelength?: number, workFunction?: number, stoppingVoltage?: number, metal?: number }',
    returns: 'the maximum kinetic energy of the photoelectrons in eV: hf − φ from printed values (tube), from the line of the graph at the given frequency, or e × the stopping voltage; refused when no electrons are emitted',
    run: (s, a) => calc(keMax(modelOf(s, photoelectricModel), a)),
  },
  photo_stopping_voltage: {
    kinds: ['photoelectric_setup'], args: '{ frequency?: number, wavelength?: number, workFunction?: number, metal?: number }',
    returns: 'the stopping voltage in volts, KE_max ÷ e — the printed value, or (hf − φ)/e from printed values or arguments; refused when no electrons are emitted',
    run: (s, a) => (a.stoppingVoltage !== undefined ? fail('the stopping voltage is what this checker finds — do not give it as an argument') : calc(keMax(modelOf(s, photoelectricModel), a))),
  },
  photo_work_function: {
    kinds: ['photoelectric_setup'], args: '{ stoppingVoltage?: number, keMax?: number, frequency?: number, wavelength?: number, metal?: number }',
    returns: 'the work function in eV: printed on the tube, or hf − e·V_stop from the measured stopping voltage (an argument); on the graph h × the threshold frequency read off the axis (or the labelled intercept)',
    run: (s, a) => (a.workFunction !== undefined ? fail('the work function is what this checker finds — do not give it as an argument') : calc(workFunction(modelOf(s, photoelectricModel), a))),
  },
  photo_threshold_frequency: {
    kinds: ['photoelectric_setup'], args: '{ workFunction?: number, stoppingVoltage?: number, frequency?: number, wavelength?: number, metal?: number }',
    returns: 'the threshold frequency in units of 10¹⁴ Hz, φ ÷ h — read where the line leaves the frequency axis of the graph, or from the work function (printed, found from a stopping voltage, or given)',
    run: (s, a) => calc(workFunction(modelOf(s, photoelectricModel), a) / H14),
  },
  photo_planck_slope: {
    kinds: ['photoelectric_setup'], args: '{}',
    returns: 'the slope of the line in units of 10⁻¹⁵ eV·s (Planck\'s constant, 4.136) — from the printed slope label or from two numbered axes; refused when neither is there',
    run: (s) => {
      const m = graph(s);
      if (m.slopeLabel === 'value' || (m.xNumbers && m.yNumbers)) return approx(H14 * 10);
      return fail(`the slope cannot be found from this graph: ${m.slopeLabel === 'blank' ? 'its label is a "?" and ' : ''}the axes are not both numbered`);
    },
  },
  photo_emits: {
    kinds: ['photoelectric_setup'], args: '{ frequency?: number, wavelength?: number, workFunction?: number, metal?: number }',
    returns: '"yes" or "no": whether the light ejects electrons (photon energy above the work function) — from printed values (tube), or the graph\'s threshold and the given frequency',
    run: (s, a) => {
      const m = modelOf(s, photoelectricModel);
      const e = photonEnergy(m, a);
      const phi = workFunction(m, a);
      return Math.abs(e - phi) < 1e-9 ? fail('the photon energy equals the work function exactly — a borderline case is not a fair question') : label(e > phi ? 'yes' : 'no');
    },
  },
  photo_larger_work_function: {
    kinds: ['photoelectric_setup'], args: '{}',
    returns: 'the legend label of the metal with the larger work function — the line that leaves the frequency axis further to the right (graph of two metals)',
    run: (s) => {
      const m = graph(s);
      if (m.metals.length < 2) return fail('the graph shows one metal only');
      return label((m.metals[0].threshold > m.metals[1].threshold ? m.metals[0] : m.metals[1]).label);
    },
  },
};

export const PART: Batch4Part = {
  kinds: ['doppler_wavefronts', 'photoelectric_setup'],
  describe: (spec, printed, out) => (spec.type === 'doppler_wavefronts' ? describeDoppler(spec, printed, out) : spec.type === 'photoelectric_setup' ? describePhoto(spec, printed, out) : ''),
  checkers: { ...dopplerCheckers, ...photoCheckers },
};
