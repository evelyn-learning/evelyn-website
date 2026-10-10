/**
 * Batch 5, part "em" (transformer; induction_loop: magnet, field): the TEXT
 * transcription and the deterministic checkers. Conventions:
 * figure-core-batch4-kit.ts.
 *
 * WHAT A CHECKER MAY USE. A quantity is taken from the derivation ARGUMENTS
 * when it is passed there (a value the question's text gives), otherwise from
 * the figure — and from the figure only when it is PRINTED (`show: 'value'`).
 * A "?" is not a value, and neither is a number the spec holds but does not
 * print: the checker refuses, naming the argument to pass. What the drawing
 * itself shows without a number counts as given: which coil of a transformer
 * is drawn with more loops (unless `windings: 'equal'`), every turn of a
 * `windings: 'counted'` coil, the pole that faces the loop, the way the magnet
 * or the loop moves, dots and crosses. A direction is refused when the thing
 * that fixes it is itself a blank (the poles, the field direction).
 *
 * WORDS A DIRECTION IS GIVEN IN. "clockwise" / "counterclockwise" (one word —
 * pass `wording: 'anticlockwise'` for that spelling), "up" / "down" for the
 * near side of the loop in the magnet variant, and "no current" when nothing
 * is induced. A multiple-choice option must use the same word.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { inductionModel, type FieldLoopModel, type InductionModel, type MagnetLoopModel } from '../../src/lib/tutor/practice-figure/kinds/induction-loop';
import { transformerModel, type EmQuantity, type TransformerKey, type TransformerModel } from '../../src/lib/tutor/practice-figure/kinds/transformer';
import { BLANK, argNum, fail, label, measured, modelOf, num, pick, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

/** One printed quantity as a transcription line — nothing when it is not printed. */
function pq(printed: string[], role: string, q: EmQuantity): string {
  if (q.show === 'none') return '';
  const line = q.show === 'value' ? `"${q.printed}"` : q.symbol ? `"${q.symbol} =" ${BLANK}` : BLANK;
  printed.push(`${role}: ${line}`);
  return line;
}

// ── transcriptions ──────────────────────────────────────────────────────────

function describeTransformer(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  const m = modelOf(spec, transformerModel);
  const q = m.q;
  // (The title line is figure-core.ts's own.)
  printed.push(`coil name: "${m.labels[0]}"`, `coil name: "${m.labels[1]}"`);
  const src = m.source === 'ac' ? 'an AC source (a circle with a wave in it)' : m.source === 'dc' ? 'a battery (a DC source)' : 'two open terminals';
  const load = m.load === 'resistor' ? 'a resistor' : m.load === 'lamp' ? 'a lamp' : 'two open terminals';
  out.push(`  two coils are wound on opposite sides of a rectangular core: the left one, named "${m.labels[0]}", is joined to ${src}; the right one, named "${m.labels[1]}", is joined to ${load}`);
  if (m.coreLabel) {
    printed.push(`core label: "${m.coreLabel}"`);
    out.push(`  the core is labelled "${m.coreLabel}"`);
  }
  if (m.windings === 'counted') out.push(`  every turn is drawn: the coil "${m.labels[0]}" has ${m.loops[0]} loop${m.loops[0] === 1 ? '' : 's'} and the coil "${m.labels[1]}" has ${m.loops[1]}`);
  else if (m.loops[0] === m.loops[1]) out.push('  both coils are drawn with the same number of loops (a schematic — the loops drawn are not the numbers of turns)');
  else out.push(`  the coil "${m.labels[m.loops[0] > m.loops[1] ? 0 : 1]}" is drawn with more loops than the other (a schematic — it shows which coil has more turns, not how many)`);
  const rows: Array<[TransformerKey, string, string]> = [
    ['Ip', 'primary current', `over the upper wire of "${m.labels[0]}"`], ['Vp', 'primary voltage', `beside the ${m.source === 'none' ? 'terminals' : 'source'}`], ['Np', 'primary turns', `under "${m.labels[0]}"`],
    ['Is', 'secondary current', `over the upper wire of "${m.labels[1]}"`], ['Vs', 'secondary voltage', `beside the ${m.load === 'none' ? 'terminals' : m.load} of "${m.labels[1]}"`], ['Ns', 'secondary turns', `under "${m.labels[1]}"`],
  ];
  for (const [k, role, where] of rows) {
    const s = pq(printed, role, q[k]);
    if (s) out.push(`  ${where}: ${s}`);
  }
  if (m.loadLabel) {
    printed.push(`load label: "${m.loadLabel}"`);
    out.push(`  under "${m.labels[1]}", for the ${m.load === 'none' ? 'output' : m.load}: "${m.loadLabel}"`);
  }
  return 'a diagram of a transformer';
}

function describeMagnet(m: MagnetLoopModel, printed: string[], out: string[]): string {
  const thing = m.coil ? 'coil' : 'loop';
  out.push(`  a bar magnet lies on the axis of a circular ${m.coil ? 'coil of wire (drawn as three loops)' : 'loop of wire'}, to the ${m.magnetSide} of it; a dashed line marks the axis`);
  out.push(`  the ${thing} is drawn in perspective, seen from in front and a little from the magnet's side: the half of the ${thing} away from the magnet is its near side and is drawn heavier`);
  if (m.poles === 'value') {
    printed.push(`pole: "${m.pole}"`, `pole: "${m.pole === 'N' ? 'S' : 'N'}"`);
    out.push(`  the end of the magnet that faces the ${thing} is marked "${m.pole}", the other end "${m.pole === 'N' ? 'S' : 'N'}"`);
  } else {
    printed.push(`pole: ${BLANK}`, `pole: ${BLANK}`);
    out.push(`  both ends of the magnet are blanks ${BLANK} — its poles are not named`);
  }
  if (m.motion === 'rest') {
    printed.push('note: "at rest"');
    out.push('  the magnet is marked "at rest"');
  } else {
    printed.push(`arrow label: "${m.velocityLabel}"`);
    out.push(`  an arrow over the magnet, labelled "${m.velocityLabel}", points ${m.motion === 'toward' ? 'toward' : 'away from'} the ${thing}: the magnet is moving ${m.motion === 'toward' ? 'toward' : 'away from'} it`);
  }
  if (m.meter) {
    printed.push('meter: "G"');
    out.push(`  the ${thing} is joined to a meter marked "G"`);
  }
  const n = pq(printed, 'turns', m.q.turns);
  if (n) out.push(`  under the ${thing}: ${n}`);
  if (m.current === 'blank') {
    printed.push(`induced current: ${BLANK}`);
    out.push(`  a blank ${BLANK} on the near side of the ${thing} stands where the direction of the induced current would be drawn`);
  } else if (m.current === 'value') {
    if (m.nearSide === 'none') {
      printed.push('current label: "I = 0"');
      out.push(`  beside the ${thing}: "I = 0" — no current is drawn`);
    } else {
      printed.push('current label: "I"');
      out.push(`  an arrowhead on the near side of the ${thing}, labelled "I", points ${m.nearSide} the page: the induced current`);
    }
  }
  return `a sketch of a bar magnet and a ${thing} of wire`;
}

function describeField(m: FieldLoopModel, printed: string[], out: string[]): string {
  const q = m.q;
  if (m.showField === 'value') out.push(`  a region bounded by a dashed outline is filled with ${m.field === 'into' ? 'crosses (×), the sign of a magnetic field directed into the page' : 'dots (•), the sign of a magnetic field directed out of the page'}`);
  else {
    printed.push(`caption: "field direction:" ${BLANK}`);
    out.push(`  a region of magnetic field is bounded by a dashed outline; it is drawn empty, and over it "field direction:" is followed by a blank ${BLANK} — the direction of the field is not shown`);
  }
  out.push(m.position === 'inside' ? '  a rectangular loop of wire lies wholly inside the region' : `  a rectangular loop of wire lies half inside the region, across its ${(m.position === 'entering') === (m.direction === 'right') ? 'left' : 'right'} edge`);
  if (m.showField === 'value') {
    const b = pq(printed, 'field strength', q.B);
    if (b) out.push(`  over the region: ${b}`);
    if (m.change) {
      printed.push(`caption: "${q.B.show === 'none' ? `B ${m.change}` : `(${m.change})`}"`);
      out.push(`  over the region the field is marked as ${m.change}`);
    }
  }
  if (m.direction) {
    const sp = q.speed.show === 'none' ? (printed.push('arrow label: "v"'), '"v"') : pq(printed, 'speed', q.speed);
    out.push(`  an arrow from the ${m.direction} side of the loop, labelled ${sp}, points to the ${m.direction}: the loop is moving ${m.position === 'entering' ? 'further into the region' : m.position === 'leaving' ? 'out of the region' : 'within the region'}`);
  } else out.push('  no velocity arrow is drawn: the loop is at rest');
  const L = pq(printed, 'side length', q.length);
  if (L) out.push(`  a dimension line beside the upright side of the loop is marked ${L}`);
  const R = pq(printed, 'resistance', q.resistance);
  if (R) out.push(`  under the loop: ${R}`);
  if (m.current === 'blank') {
    printed.push(`induced current: ${BLANK}`);
    out.push(`  a blank ${BLANK} on the top side of the loop stands where the direction of the induced current would be drawn`);
  } else if (m.current === 'value') {
    if (m.sense === 'none') {
      printed.push('current label: "I = 0"');
      out.push('  in the loop: "I = 0" — no current is drawn');
    } else {
      printed.push('current label: "I"');
      out.push(`  arrowheads on the loop, labelled "I", show the induced current: it runs to the ${m.sense === 'clockwise' ? 'right' : 'left'} along the top side and to the ${m.sense === 'clockwise' ? 'left' : 'right'} along the bottom side`);
    }
  }
  return 'a sketch of a loop of wire and a region of magnetic field';
}

function describe(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  if (spec.type === 'transformer') return describeTransformer(spec, printed, out);
  if (spec.type !== 'induction_loop') return '';
  const m = modelOf(spec, inductionModel);
  return m.variant === 'magnet' ? describeMagnet(m, printed, out) : describeField(m, printed, out);
}

// ── checkers ────────────────────────────────────────────────────────────────

const positive = (v: number, what: string): number => (v > 0 ? v : fail(`${what} must be greater than 0`));
const USE_NOTE = 'each quantity is the argument of its name when passed, else the value PRINTED on the figure — refused when it is neither';
/** The first route that every needed value is there for; when none is, the refusal of the first. */
function firstOf<T>(...routes: Array<() => T>): T {
  let first: unknown;
  for (const route of routes) {
    try { return route(); } catch (e) { first ??= e; }
  }
  throw first;
}

const T_NAMES: Record<TransformerKey, string> = { Np: 'the number of primary turns', Ns: 'the number of secondary turns', Vp: 'the primary voltage', Vs: 'the secondary voltage', Ip: 'the primary current', Is: 'the secondary current' };
/** A transformer quantity as a checker may use it. The turns of a `counted` coil are drawn, so they count as given. */
function tval(m: TransformerModel, a: P, key: TransformerKey): number {
  if (a[key] !== undefined) return positive(argNum(a, key), key);
  const q = m.q[key];
  if (q.value !== undefined && (q.show === 'value' || (m.windings === 'counted' && (key === 'Np' || key === 'Ns') && q.show !== 'blank'))) return q.value;
  return fail(`${T_NAMES[key]} is not printed on the figure${q.show === 'blank' ? ' (it is the "?")' : ''} — pass it as the derivation argument "${key}" if the question's text gives it`);
}
function efficiencyOf(m: TransformerModel, a: P): number {
  if (a.efficiency !== undefined) {
    const e = argNum(a, 'efficiency');
    return e > 0 && e <= 1 ? e : fail('derivation argument "efficiency" must be greater than 0 and at most 1');
  }
  return m.efficiency === 1 ? 1 : fail('the efficiency is never printed on the figure — pass it as the derivation argument "efficiency" (the question must state it)');
}
/** Ns ÷ Np — from the turns, else from the voltages (the same number for a transformer). */
const ratioOf = (m: TransformerModel, a: P): number => firstOf(() => tval(m, a, 'Ns') / tval(m, a, 'Np'), () => tval(m, a, 'Vs') / tval(m, a, 'Vp'));

const F_NAMES: Record<string, string> = { B: 'the field strength', length: 'the length of the side that cuts the field', speed: 'the speed of the loop', resistance: 'the resistance of the loop', turns: 'the number of turns' };
function ival(m: InductionModel, a: P, key: string): number {
  if (a[key] !== undefined) return positive(argNum(a, key), key);
  const q = (m.q as Record<string, EmQuantity | undefined>)[key];
  if (q && q.value !== undefined && q.show === 'value') return q.value;
  return fail(`${F_NAMES[key] ?? key} is not printed on the figure${q?.show === 'blank' ? ' (it is the "?")' : ''} — pass it as the derivation argument "${key}" if the question's text gives it`);
}
/** The model when the figure fixes the direction of the induced current — refused when the pole or the field direction is itself a blank. */
function settled(spec: PracticeFigureSpec): InductionModel {
  const m = modelOf(spec, inductionModel);
  if (m.variant === 'magnet' && m.poles === 'blank') return fail('the poles of the magnet are blanks on this figure — it does not settle the direction of the induced current (use induction_cause for the pole)');
  if (m.variant === 'field' && m.showField === 'blank') return fail('the direction of the field is a blank on this figure — it does not settle the direction of the induced current (use induction_cause for the field direction)');
  return m;
}

const checkers: Record<string, Batch4CheckerDef> = {
  transformer_value: {
    kinds: ['transformer'], args: '{ want: Vs | Vp | Ns | Np | Is | Ip | turns_ratio | power_in | power_out, Np?, Ns?, Vp?, Vs?, Ip?, Is?, efficiency? }',
    returns: `one quantity of the transformer: Vs/Vp = Ns/Np; Vs·Is = efficiency × Vp·Ip (so Is/Ip = Np/Ns when it is ideal — the efficiency is 1 unless the spec or the argument says otherwise, and a spec efficiency below 1 must be passed as the argument because it is never printed); turns_ratio is Ns ÷ Np; power_in = Vp·Ip and power_out = Vs·Is (W, or the figure's units). With a DC source (a battery) Vs and Is are 0. ${USE_NOTE}; the turns of a coil drawn with windings "counted" count as printed`,
    run: (s, a) => {
      const m = modelOf(s, transformerModel);
      const want = pick(a, 'want', ['Vs', 'Vp', 'Ns', 'Np', 'Is', 'Ip', 'turns_ratio', 'power_in', 'power_out'] as const);
      if (m.source === 'dc') return want === 'Vs' || want === 'Is' || want === 'power_out' ? num(0) : fail('the primary is joined to a battery: a steady current induces nothing in the secondary — only Vs, Is and power_out (all 0) can be asked');
      switch (want) {
        case 'Vs': return measured(firstOf(() => tval(m, a, 'Vp') * tval(m, a, 'Ns') / tval(m, a, 'Np'), () => efficiencyOf(m, a) * tval(m, a, 'Vp') * tval(m, a, 'Ip') / tval(m, a, 'Is')));
        case 'Vp': return measured(firstOf(() => tval(m, a, 'Vs') * tval(m, a, 'Np') / tval(m, a, 'Ns'), () => tval(m, a, 'Vs') * tval(m, a, 'Is') / (efficiencyOf(m, a) * tval(m, a, 'Ip'))));
        case 'Ns': return measured(tval(m, a, 'Np') * tval(m, a, 'Vs') / tval(m, a, 'Vp'));
        case 'Np': return measured(tval(m, a, 'Ns') * tval(m, a, 'Vp') / tval(m, a, 'Vs'));
        case 'Is': return measured(firstOf(() => efficiencyOf(m, a) * tval(m, a, 'Ip') / ratioOf(m, a), () => efficiencyOf(m, a) * tval(m, a, 'Vp') * tval(m, a, 'Ip') / tval(m, a, 'Vs')));
        case 'Ip': return measured(firstOf(() => tval(m, a, 'Is') * ratioOf(m, a) / efficiencyOf(m, a), () => tval(m, a, 'Vs') * tval(m, a, 'Is') / (efficiencyOf(m, a) * tval(m, a, 'Vp'))));
        case 'turns_ratio': return measured(ratioOf(m, a));
        case 'power_in': return measured(firstOf(() => tval(m, a, 'Vp') * tval(m, a, 'Ip'), () => tval(m, a, 'Vs') * tval(m, a, 'Is') / efficiencyOf(m, a)));
        default: return measured(firstOf(() => tval(m, a, 'Vs') * tval(m, a, 'Is'), () => efficiencyOf(m, a) * tval(m, a, 'Vp') * tval(m, a, 'Ip')));
      }
    },
  },
  transformer_type: {
    kinds: ['transformer'], args: '{ Np?, Ns?, Vp?, Vs? }',
    returns: 'the kind of transformer: "step-up" (more secondary turns — a higher secondary voltage), "step-down", or "neither" (equal turns) — from the printed or passed turns, else the printed or passed voltages, else the coil the figure DRAWS with more loops (refused when the coils are drawn alike with windings "equal" and nothing else settles it)',
    run: (s, a) => {
      const m = modelOf(s, transformerModel);
      const word = (r: number): string => (Math.abs(r - 1) <= 0.005 ? 'neither' : r > 1 ? 'step-up' : 'step-down');
      try {
        return label(word(ratioOf(m, a)));
      } catch (e) {
        if (m.windings === 'schematic') return label(m.loops[1] > m.loops[0] ? 'step-up' : m.loops[1] < m.loops[0] ? 'step-down' : 'neither');
        if (m.windings === 'equal') return fail('the coils are drawn alike and neither both turn counts nor both voltages are printed — the figure does not settle the kind of transformer; pass Np and Ns (or Vp and Vs) as derivation arguments if the question gives them');
        throw e;
      }
    },
  },
  induction_current_direction: {
    kinds: ['induction_loop'], args: '{ view?: magnet | near_side (magnet variant; default magnet), wording?: counterclockwise | anticlockwise }',
    returns: 'the direction of the induced current by Lenz\'s law, as a word: magnet variant — "clockwise" / "counterclockwise" as seen FROM THE MAGNET looking along the axis at the loop (view: magnet), or "up" / "down" for the arrow on the near side of the loop as drawn (view: near_side); field variant — "clockwise" / "counterclockwise" as drawn on the page; "no current" when the flux is not changing. Refused when the poles or the field direction are blanks',
    run: (s, a) => {
      const m = settled(s);
      const ccw = pick(a, 'wording', ['counterclockwise', 'anticlockwise'] as const, 'counterclockwise');
      const word = (x: string): string => (x === 'none' ? 'no current' : x === 'counterclockwise' ? ccw : x);
      if (m.variant === 'field') {
        if (a.view !== undefined) return fail('derivation argument "view" is for the magnet variant — a loop in a field region is seen face on');
        return label(word(m.sense));
      }
      return label(word(pick(a, 'view', ['magnet', 'near_side'] as const, 'magnet') === 'magnet' ? m.sense : m.nearSide));
    },
  },
  induction_flux_change: {
    kinds: ['induction_loop'], args: '{}',
    returns: 'how the SIZE of the magnetic flux through the loop is changing: "increasing" (the magnet approaches; the loop enters the region; the field is marked increasing), "decreasing", or "not changing" (the magnet at rest; the loop wholly inside a steady uniform field) — settled by the motion drawn, whatever is blank',
    run: (s) => {
      const m = modelOf(s, inductionModel);
      return label(m.flux === 'steady' ? 'not changing' : m.flux);
    },
  },
  induction_cause: {
    kinds: ['induction_loop'], args: '{}',
    returns: 'the reverse reading, for a figure that DRAWS the induced current and leaves its cause blank: magnet variant — the pole that faces the loop, "N" or "S"; field variant — the direction of the field, "into" or "out" (of the page). Refused when the current is not drawn, or no current is induced',
    run: (s) => {
      const m = modelOf(s, inductionModel);
      if (m.current !== 'value') return fail('the induced current is not drawn on this figure — nothing on it settles the pole or the field direction');
      if (m.sense === 'none') return fail('no current is induced in this figure — it does not settle the pole or the field direction');
      return label(m.variant === 'magnet' ? m.pole : m.field);
    },
  },
  induction_emf: {
    kinds: ['induction_loop'], args: '{ want: emf | current, B?, length?, speed?, resistance?, turns?, flux_change?, time? }',
    returns: `the size of the induced EMF (V) or of the induced current, EMF ÷ resistance (A). With flux_change (Wb, the change through ONE turn) and time (s) passed: Faraday's law, EMF = turns × flux_change ÷ time (turns = 1 unless printed or passed). Otherwise, field variant only: a loop entering or leaving the region has EMF = B × length × speed; a loop moving wholly inside a uniform steady field has EMF 0. ${USE_NOTE}`,
    run: (s, a) => {
      const m = modelOf(s, inductionModel);
      const want = pick(a, 'want', ['emf', 'current'] as const);
      let emf: number;
      if (a.flux_change !== undefined || a.time !== undefined) {
        if (m.flux === 'steady') return fail('the flux through the loop is not changing on this figure — flux_change and time do not apply');
        const turns = a.turns !== undefined ? positive(argNum(a, 'turns'), 'turns') : m.variant === 'magnet' && m.q.turns.value !== undefined ? ival(m, a, 'turns') : 1;
        emf = (turns * Math.abs(argNum(a, 'flux_change'))) / positive(argNum(a, 'time'), 'time');
      } else if (m.variant === 'magnet') return fail('a magnet and a loop give no numbers for the EMF — pass flux_change (Wb, through one turn) and time (s) as derivation arguments');
      else if (m.flux === 'steady') emf = 0;
      else if (m.change) return fail('a loop at rest in a changing field needs the rate — pass flux_change (Wb) and time (s) as derivation arguments');
      else emf = ival(m, a, 'B') * ival(m, a, 'length') * ival(m, a, 'speed');
      if (want === 'emf') return measured(emf);
      return emf === 0 ? num(0) : measured(emf / ival(m, a, 'resistance'));
    },
  },
};

export const PART: Batch4Part = { kinds: ['transformer', 'induction_loop'], describe, checkers };
