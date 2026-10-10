/**
 * Batch 4, part "wave" (wave_diagram: transverse, standing): the TEXT
 * transcription and the deterministic checkers. Conventions:
 * figure-core-batch4-kit.ts.
 *
 * What a figure SETTLES: a printed value; a value read off the numbered axes
 * of a scaled graph (on a gridline or halfway between two); a count of drawn
 * things (crests, loops, node dots). A value hidden behind a "?" — or simply
 * not drawn — is never used: the checker refuses, or takes it as an argument
 * the question must then state.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { standingPoints, standingWavelengthFactor, waveExtrema, waveModel, waveSlope, waveY, type StandingModel, type TransverseModel } from '../../src/lib/tutor/practice-figure/kinds/wave';
import { BLANK, argIndex, argNum, argStr, fail, fmt, label, measured, modelOf, num, pick, plural, shown, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

const MEDIUM_WORDS = { string: 'a string clamped at both ends (a heavy bar at each end)', open_open: 'an air column in a tube open at both ends (two walls, no end caps)', open_closed: 'an air column in a tube closed at its left end (a wall) and open at its right end' } as const;

const onHalfStep = (v: number, step: number): boolean => Math.abs(v / (step / 2) - Math.round(v / (step / 2))) < 1e-6;
const ampText = (m: TransverseModel): string => (m.showAmplitude === 'value' ? `${fmt(Number(m.amplitude.toFixed(3)))} ${m.yUnit}` : m.showAmplitude === 'blank' ? '?' : '');
const lamText = (m: TransverseModel): string => (m.showWavelength === 'value' ? `${fmt(Number(m.wavelength.toFixed(3)))} ${m.xUnit}` : m.showWavelength === 'blank' ? '?' : '');
const lengthText = (m: StandingModel): string => (m.showLength === 'value' ? `${fmt(Number((m.length as number).toFixed(3)))} ${m.unit}` : m.showLength === 'name' ? 'L' : m.showLength === 'blank' ? '?' : '');

function describe(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  const m = modelOf(spec, waveModel);
  if (m.variant === 'standing') {
    out.push(`A standing wave in ${MEDIUM_WORDS[m.medium]}${m.harmonics.length > 1 ? ` — ${m.harmonics.length} of them, one under another, in the same ${m.medium === 'string' ? 'string' : 'tube'}` : ''}. Each is drawn as its two extreme shapes: a solid curve and its mirror image, dashed, about a dotted centre line.${m.medium === 'string' ? '' : ' The curves show the displacement of the air.'}`);
    m.harmonics.forEach((n, i) => {
      const pts = standingPoints(m.medium, n);
      const loops = m.medium === 'open_closed' ? `${n === 1 ? 'half a loop' : `${(n - 1) / 2} whole loop${n === 3 ? '' : 's'} and half a loop`} (starting from zero at the closed end, largest at the open end)` : m.medium === 'open_open' ? `largest at both ends, crossing the centre line ${plural(pts.nodes.length, 'time')}` : plural(n, 'loop');
      const h = m.harmonicLabels === 'value' ? `n = ${n}` : m.harmonicLabels === 'blank' ? 'n = ?' : '';
      if (h) printed.push(`row label: ${h === 'n = ?' ? `"n =" ${BLANK}` : `"${h}"`}`);
      const bits: string[] = [`the curves form ${loops}`];
      if (m.nodes !== 'none') bits.push(`${plural(pts.nodes.length, 'filled dot')} on the centre line where the curves cross it${m.nodes === 'labels' ? ', each lettered "N"' : ''}`);
      if (m.antinodes !== 'none') bits.push(`${plural(pts.antinodes.length, 'open ring')} where the curves are furthest from the centre line${m.antinodes === 'labels' ? ', each lettered "A"' : ''}`);
      out.push(`  ${m.harmonics.length > 1 ? `Row ${i + 1}` : 'The wave'}${h ? ` (labelled ${h === 'n = ?' ? '"n =" and a blank "?" box' : `"${h}"`})` : ''}: ${bits.join('; ')}.`);
    });
    if (m.nodes === 'labels') printed.push('node letter: "N"');
    if (m.antinodes === 'labels') printed.push('antinode letter: "A"');
    const L = lengthText(m);
    if (L) {
      printed.push(`length label: ${shown(L)}`);
      out.push(`A dimension line under the ${m.medium === 'string' ? 'string' : 'tube'}, from end to end, is labelled ${shown(L)}.`);
    } else out.push(`The length of the ${m.medium === 'string' ? 'string' : 'tube'} is not marked.`);
    return 'a standing-wave diagram';
  }
  const what = m.axis === 'time' ? 'the displacement of one point against time' : 'a snapshot of a transverse wave (displacement against position)';
  const crests = waveExtrema(m, 1);
  const troughs = waveExtrema(m, -1);
  out.push(`A smooth sinusoidal curve showing ${what}: ${fmt(m.cycles)} full cycle${m.cycles === 1 ? '' : 's'}, with ${plural(crests.length, 'crest')} and ${plural(troughs.length, 'trough')}. It ${m.start === 'sine' ? 'starts on the equilibrium line, rising' : 'starts on a crest'}.`);
  if (m.scale) {
    const xl = `${m.axis === 'time' ? 'Time' : 'Position'} (${m.xUnit})`;
    const yl = `Displacement (${m.yUnit})`;
    printed.push(`x-axis label: "${xl}"`, `y-axis label: "${yl}"`);
    out.push(`It is drawn on a grid with numbered axes: "${xl}" from 0 to ${fmt(m.cycles * m.wavelength)} in steps of ${fmt(m.xStep)}, "${yl}" from ${fmt(-m.yMax)} to ${fmt(m.yMax)} in steps of ${fmt(m.yStep)}.`);
    if (onHalfStep(m.amplitude, m.yStep)) out.push(`  The crests reach ${fmt(m.amplitude)} and the troughs ${fmt(-m.amplitude)} on the displacement axis.`);
    if (onHalfStep(m.wavelength, m.xStep)) out.push(`  Crests at ${m.axis === 'time' ? 't' : 'x'} = ${crests.map((c) => fmt(Number(c.toFixed(6)))).join(', ')}; troughs at ${troughs.map((c) => fmt(Number(c.toFixed(6)))).join(', ')}.`);
  } else {
    out.push('There are no numbered axes; a dashed horizontal line marks the equilibrium position.');
    const a = ampText(m);
    if (a) {
      printed.push(`amplitude label: ${shown(a)}`);
      out.push(`  A double-headed vertical arrow from the equilibrium line up to the level of a crest is labelled ${shown(a)}.`);
    }
    const l = lamText(m);
    if (l) {
      printed.push(`${m.axis === 'time' ? 'period' : 'wavelength'} label: ${shown(l)}`);
      out.push(`  A horizontal dimension line from one ${crests.length >= 2 ? 'crest' : 'trough'} to the next is labelled ${shown(l)}.`);
    }
    for (const w of m.labels) {
      printed.push(`word: "${w === 'equilibrium' ? 'equilibrium position' : w}"`);
      out.push(w === 'equilibrium' ? '  A key under the wave names the dashed line "equilibrium position".' : `  The word "${w}" is printed at a ${w}.`);
    }
  }
  for (const q of m.points) {
    printed.push(`point label: "${q.label}"`);
    const y = waveY(m, q.x);
    const where = Math.abs(Math.abs(y) - m.amplitude) < 1e-9 * m.amplitude ? (y > 0 ? 'on a crest' : 'in a trough') : Math.abs(y) < 1e-9 * m.amplitude ? `on the equilibrium line, where the curve is ${waveSlope(m, q.x) > 0 ? 'rising' : 'falling'} to the right` : `${y > 0 ? 'above' : 'below'} the equilibrium line, where the curve is ${waveSlope(m, q.x) > 0 ? 'rising' : 'falling'} to the right`;
    out.push(`  A dot on the curve lettered "${q.label}" is ${where}${m.scale && onHalfStep(q.x, m.xStep) ? ` (at ${m.axis === 'time' ? 't' : 'x'} = ${fmt(q.x)})` : ''}.`);
  }
  if (m.direction) {
    if (m.speedLabel) printed.push(`arrow label: ${shown(m.speedLabel)}`);
    out.push(`  An arrow under the wave points to the ${m.direction}${m.speedLabel ? `, labelled ${shown(m.speedLabel)}` : ''}: the direction the wave travels.`);
  }
  return m.axis === 'time' ? 'a displacement–time record of a wave' : 'a diagram of a transverse wave';
}

// ── what the figure settles ─────────────────────────────────────────────────

function transverse(spec: PracticeFigureSpec): TransverseModel {
  const m = modelOf(spec, waveModel);
  return m.variant === 'transverse' ? m : fail('this checker is for the transverse variant, not a standing wave');
}
function standing(spec: PracticeFigureSpec): StandingModel {
  const m = modelOf(spec, waveModel);
  return m.variant === 'standing' ? m : fail('this checker is for the standing variant, not a travelling wave');
}
function amplitudeOf(m: TransverseModel): number {
  if (m.showAmplitude === 'value') return m.amplitude;
  if (m.scale) return onHalfStep(m.amplitude, m.yStep) ? m.amplitude : fail('the amplitude is not on a gridline (or halfway between two) — it cannot be read off the graph');
  return fail(`the amplitude is ${m.showAmplitude === 'blank' ? 'hidden behind a "?"' : 'not marked'} — the figure does not settle it`);
}
/** The wavelength (position axis) or the period (time axis), when the figure shows it. */
function repeatOf(m: TransverseModel): number {
  const what = m.axis === 'time' ? 'period' : 'wavelength';
  if (m.showWavelength === 'value') return m.wavelength;
  if (m.scale) return onHalfStep(m.wavelength, m.xStep) ? m.wavelength : fail(`the ${what} is not a whole number of half-steps of the axis — it cannot be read off the graph`);
  return fail(`the ${what} is ${m.showWavelength === 'blank' ? 'hidden behind a "?"' : 'not marked'} — the figure does not settle it`);
}
function positive(a: P, k: string): number {
  const v = argNum(a, k);
  return v > 0 ? v : fail(`derivation argument "${k}" must be greater than 0`);
}
function rowOf(m: StandingModel, a: P): number {
  return m.harmonics[argIndex(a, 'row', m.harmonics.length, 'row of the figure (top row = 0)')];
}
function lengthOf(m: StandingModel, a: P): number {
  if (a.length !== undefined) return positive(a, 'length');
  if (m.showLength === 'value') return m.length as number;
  return fail(`the length is ${m.showLength === 'blank' ? 'hidden behind a "?"' : m.showLength === 'name' ? 'only named "L"' : 'not marked'} — give it as the derivation argument "length" (the question must then state it)`);
}

const checkers: Record<string, Batch4CheckerDef> = {
  wave_amplitude: {
    kinds: ['wave_diagram'], args: '{}', returns: 'the amplitude of the travelling wave — printed on its arrow, or read off the displacement axis of a scaled graph (refused when hidden)',
    run: (s) => measured(amplitudeOf(transverse(s))),
  },
  wave_wavelength: {
    kinds: ['wave_diagram'], args: '{ speed?: number, frequency?: number }', returns: 'the wavelength: printed or read off a displacement–position figure; or, when it is hidden, v ÷ f from the two arguments (which the question must state)',
    run: (s, a) => {
      const m = transverse(s);
      if (a.speed !== undefined || a.frequency !== undefined) return measured(positive(a, 'speed') / positive(a, 'frequency'));
      if (m.axis === 'time') return fail('a displacement–time record shows a period, not a wavelength — use wave_period, or give speed and frequency');
      return measured(repeatOf(m));
    },
  },
  wave_period: {
    kinds: ['wave_diagram'], args: '{}', returns: 'the period: printed or read off a displacement–time record (refused for a snapshot against position, and when hidden)',
    run: (s) => {
      const m = transverse(s);
      if (m.axis !== 'time') return fail('a snapshot against position shows a wavelength, not a period — use wave_frequency with speed');
      return measured(repeatOf(m));
    },
  },
  wave_frequency: {
    kinds: ['wave_diagram'], args: '{ speed?: number }', returns: 'the frequency: 1 ÷ period for a displacement–time record; for a snapshot against position, speed ÷ wavelength (speed is an argument the question states)',
    run: (s, a) => {
      const m = transverse(s);
      if (m.axis === 'time') return measured(1 / repeatOf(m));
      if (a.speed === undefined) return fail('a snapshot against position does not fix the frequency — give the wave speed as the derivation argument "speed"');
      return measured(positive(a, 'speed') / repeatOf(m));
    },
  },
  wave_speed: {
    kinds: ['wave_diagram'], args: '{ frequency?: number, period?: number, wavelength?: number }', returns: 'the wave speed v = fλ: a snapshot against position supplies λ and needs frequency (or period); a displacement–time record supplies T and needs wavelength',
    run: (s, a) => {
      const m = transverse(s);
      if (m.axis === 'time') return a.wavelength === undefined ? fail('a displacement–time record does not fix the wavelength — give it as the derivation argument "wavelength"') : measured(positive(a, 'wavelength') / repeatOf(m));
      if (a.frequency !== undefined) return measured(positive(a, 'frequency') * repeatOf(m));
      if (a.period !== undefined) return measured(repeatOf(m) / positive(a, 'period'));
      return fail('a snapshot against position does not fix the frequency — give "frequency" or "period" as a derivation argument');
    },
  },
  wave_count: {
    kinds: ['wave_diagram'], args: '{ want: crests | troughs | cycles }', returns: 'how many crests, troughs or full cycles (wavelengths) of the travelling wave are drawn',
    run: (s, a) => {
      const m = transverse(s);
      const want = pick(a, 'want', ['crests', 'troughs', 'cycles'] as const);
      return num(want === 'cycles' ? m.cycles : waveExtrema(m, want === 'crests' ? 1 : -1).length);
    },
  },
  wave_point_displacement: {
    kinds: ['wave_diagram'], args: '{ point: label }', returns: 'the displacement of a lettered point, read off a scaled graph (the point must sit on a crest, a trough, the axis or a gridline crossing)',
    run: (s, a) => {
      const m = transverse(s);
      const name = argStr(a, 'point');
      const q = m.points.find((x) => x.label === name) ?? fail(`the figure has no point lettered "${name}" (points: ${m.points.map((x) => x.label).join(', ') || 'none'})`);
      if (!m.scale) return fail('the figure has no numbered axes — the displacement of a point cannot be read');
      const y = waveY(m, q.x);
      if (!onHalfStep(q.x, m.xStep) || !onHalfStep(Number(y.toFixed(9)), m.yStep)) return fail(`the point "${name}" is not on a gridline crossing (nor halfway between) — its displacement cannot be read exactly`);
      return measured(Number(y.toFixed(9)));
    },
  },
  wave_point_motion: {
    kinds: ['wave_diagram'], args: '{ point: label }', returns: 'the label "up", "down" or "at rest" — the way a lettered point of the medium is moving at the instant shown, from the direction the wave travels (a point on a crest or in a trough is momentarily at rest)',
    run: (s, a) => {
      const m = transverse(s);
      const name = argStr(a, 'point');
      const q = m.points.find((x) => x.label === name) ?? fail(`the figure has no point lettered "${name}" (points: ${m.points.map((x) => x.label).join(', ') || 'none'})`);
      if (m.axis === 'time') return fail('a displacement–time record is of one point — use the slope of the record itself');
      if (!m.direction) return fail('the figure does not show which way the wave travels — the motion of a point is not settled');
      const slope = waveSlope(m, q.x);
      if (Math.abs(slope) < 1e-9) return label('at rest');
      // The shape moves along: a point ahead of a rising slope (for a wave going right) is about to be lower.
      return label((m.direction === 'right' ? -slope : slope) > 0 ? 'up' : 'down');
    },
  },
  standing_harmonic: {
    kinds: ['wave_diagram'], args: '{ row?: index (0) }', returns: 'the harmonic number n of a standing wave, from its shape (a tube closed at one end has n = 1, 3, 5: the 3rd harmonic is its second possible wave)',
    run: (s, a) => num(rowOf(standing(s), a)),
  },
  standing_count: {
    kinds: ['wave_diagram'], args: '{ want: nodes | antinodes | loops, row?: index (0) }', returns: 'the number of nodes (the fixed ends of a string and the closed end of a tube included), antinodes (open ends included) or whole loops of a standing wave',
    run: (s, a) => {
      const m = standing(s);
      const n = rowOf(m, a);
      const want = pick(a, 'want', ['nodes', 'antinodes', 'loops'] as const);
      const pts = standingPoints(m.medium, n);
      if (want === 'loops') return m.medium === 'string' ? num(n) : fail('"loops" is a count for a string (an air column ends in half loops) — count nodes or antinodes');
      return num(want === 'nodes' ? pts.nodes.length : pts.antinodes.length);
    },
  },
  standing_wavelength: {
    kinds: ['wave_diagram'], args: '{ row?: index (0), length?: number }', returns: 'the wavelength of a standing wave: 2L/n on a string or in a tube open at both ends, 4L/n in a tube closed at one end — L printed on the figure, or given as an argument when it is hidden',
    run: (s, a) => { const m = standing(s); return measured(standingWavelengthFactor(m.medium, rowOf(m, a)) * lengthOf(m, a)); },
  },
  standing_length: {
    kinds: ['wave_diagram'], args: '{ wavelength: number, row?: index (0) }', returns: 'the length of the string or tube from the wavelength of one of its standing waves: nλ/2, or nλ/4 in a tube closed at one end',
    run: (s, a) => { const m = standing(s); return measured(positive(a, 'wavelength') / standingWavelengthFactor(m.medium, rowOf(m, a))); },
  },
  standing_frequency: {
    kinds: ['wave_diagram'], args: '{ speed?: number, fundamental?: number, row?: index (0), length?: number }', returns: 'the frequency of a standing wave: speed ÷ wavelength (needs the wave speed and the length), or n × the fundamental frequency',
    run: (s, a) => {
      const m = standing(s);
      const n = rowOf(m, a);
      if (a.fundamental !== undefined) return measured(n * positive(a, 'fundamental'));
      if (a.speed === undefined) return fail('give the wave speed ("speed") or the fundamental frequency ("fundamental") as a derivation argument — the figure shows neither');
      return measured(positive(a, 'speed') / (standingWavelengthFactor(m.medium, n) * lengthOf(m, a)));
    },
  },
  standing_speed: {
    kinds: ['wave_diagram'], args: '{ frequency: number, row?: index (0), length?: number }', returns: 'the wave speed from the frequency of one standing wave: v = fλ with λ = 2L/n (4L/n in a tube closed at one end)',
    run: (s, a) => { const m = standing(s); return measured(positive(a, 'frequency') * standingWavelengthFactor(m.medium, rowOf(m, a)) * lengthOf(m, a)); },
  },
};

export const PART: Batch4Part = {
  kinds: ['wave_diagram'],
  describe,
  checkers,
};
