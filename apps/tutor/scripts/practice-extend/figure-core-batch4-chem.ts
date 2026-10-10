/**
 * Batch 4, part "chem" (energy_levels — orbital boxes and level ladders —
 * heating_curve, electrochemical_cell): the TEXT transcription and the
 * deterministic checkers. Conventions: figure-core-batch4-kit.ts.
 *
 * Each kind is read through the model its renderer draws from. A checker
 * refuses when what it needs is hidden on the figure (a "?" box, an
 * unnumbered axis, a cell that does not show which electrode is the anode)
 * and is not handed over in its arguments either.
 *
 * Constants: hc = 1239.84 eV·nm; h = 4.135668 × 10⁻¹⁵ eV·s = 6.62607 × 10⁻³⁴ J·s;
 * c = 2.99792 × 10⁸ m/s; F = 96 485 C/mol.
 */
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { CORE_ELECTRONS, energyLevelsModel, levelsLayout, madelung, type BoxState, type Level, type LevelsModel, type OrbitalDiagram, type OrbitalModel } from '../../src/lib/tutor/practice-figure/kinds/energy-levels';
import { heatingModel, isPlateau, type HeatSegment, type HeatingModel } from '../../src/lib/tutor/practice-figure/kinds/heating-curve';
import { cellModel, positiveSide, showsAnode, type CellModel, type Side } from '../../src/lib/tutor/practice-figure/kinds/electrochemical-cell';
import type { Derived } from './figure-core';
import { BLANK, approx, argIndex, argNum, fail, fmt, isNum, label, measured, modelOf, num, pick, plural, shown, text, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

const minus = (v: number, dp = 3): string => { const r = Number(v.toFixed(dp)); return String(Object.is(r, -0) ? 0 : r).replace(/^-/, '−'); };

// ── orbital boxes ───────────────────────────────────────────────────────────

const BOX_WORDS: Record<BoxState, string> = { '': '[empty]', u: '[up]', d: '[down]', ud: '[up, down]', uu: '[up, up]', dd: '[down, down]', '?': `[${BLANK}]` };
const ELEMENTS = ['H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca', 'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr'];
const ELEMENT_NAMES = ['hydrogen', 'helium', 'lithium', 'beryllium', 'boron', 'carbon', 'nitrogen', 'oxygen', 'fluorine', 'neon', 'sodium', 'magnesium', 'aluminium', 'silicon', 'phosphorus', 'sulfur', 'chlorine', 'argon', 'potassium', 'calcium', 'scandium', 'titanium', 'vanadium', 'chromium', 'manganese', 'iron', 'cobalt', 'nickel', 'copper', 'zinc', 'gallium', 'germanium', 'arsenic', 'selenium', 'bromine', 'krypton'];
const SUPER = '⁰¹²³⁴⁵⁶⁷⁸⁹';
const CORE_SUBSHELLS: Record<string, string[]> = { He: ['1s'], Ne: ['1s', '2s', '2p'], Ar: ['1s', '2s', '2p', '3s', '3p'], Kr: ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p'] };

function orbitalOf(spec: PracticeFigureSpec): OrbitalModel {
  const m = modelOf(spec, energyLevelsModel);
  return m.variant === 'orbital_boxes' ? m : fail('this checker reads an orbital box diagram (variant "orbital_boxes")');
}
function levelsOf(spec: PracticeFigureSpec): LevelsModel {
  const m = modelOf(spec, energyLevelsModel);
  return m.variant === 'levels' ? m : fail('this checker reads an energy-level ladder (variant "levels")');
}
function diagramArg(m: OrbitalModel, a: P): OrbitalDiagram {
  if (typeof a.diagram === 'string') {
    const d = m.diagrams.find((x) => x.label === (a.diagram as string).trim());
    return d ?? fail(`derivation argument "diagram": no diagram is labelled "${a.diagram}"`);
  }
  return m.diagrams[argIndex(a, 'diagram', m.diagrams.length, 'diagram')];
}
const boxElectrons = (b: BoxState): number => (b === '?' ? NaN : b.length);
function noBlank(d: OrbitalDiagram): void {
  if (d.subshells.some((s) => s.boxes.includes('?'))) fail('a box of the diagram is blank (a "?") — what it holds cannot be read off the figure');
}
const electronsIn = (d: OrbitalDiagram): number => (d.core ? CORE_ELECTRONS[d.core] : 0) + d.subshells.reduce((t, s) => t + s.boxes.reduce((u, b) => u + boxElectrons(b), 0), 0);
const unpairedIn = (d: OrbitalDiagram): number => d.subshells.reduce((t, s) => t + s.boxes.filter((b) => b === 'u' || b === 'd').length, 0);

/** The first rule a diagram breaks, checked in the order Pauli → Aufbau → Hund; null for a valid ground state. */
export function orbitalViolation(d: OrbitalDiagram): 'Pauli exclusion principle' | 'Aufbau principle' | "Hund's rule" | null {
  if (d.subshells.some((s) => s.boxes.some((b) => b === 'uu' || b === 'dd'))) return 'Pauli exclusion principle';
  const order = d.subshells.slice().sort(madelung);
  const count = (i: number) => order[i].boxes.reduce((t, b) => t + b.length, 0);
  const total = electronsIn(d);
  const key = order.map((s, i) => `${s.name}${count(i)}`).join(' ');
  // The two fourth-period exceptions every course teaches: Cr 4s¹3d⁵ and Cu 4s¹3d¹⁰.
  const exception = (total === 24 && /4s1 3d5$/.test(key)) || (total === 29 && /4s1 3d10$/.test(key));
  if (!exception) {
    for (let i = 0; i < order.length - 1; i++) {
      const full = count(i) === 2 * order[i].boxes.length;
      if (!full && order.slice(i + 1).some((_, j) => count(i + 1 + j) > 0)) return 'Aufbau principle';
    }
  }
  for (const s of d.subshells) {
    const pairs = s.boxes.filter((b) => b === 'ud').length;
    const singles = s.boxes.filter((b) => b === 'u' || b === 'd');
    if (pairs > 0 && s.boxes.includes('')) return "Hund's rule";
    if (new Set(singles).size > 1) return "Hund's rule";
  }
  return null;
}
/** Does the diagram show every subshell up to its highest one (with its core)? Needed to name the element. */
function startsAtTheBottom(d: OrbitalDiagram): boolean {
  const have = new Set([...(d.core ? CORE_SUBSHELLS[d.core] : []), ...d.subshells.map((s) => s.name)]);
  const all = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p'];
  const top = Math.max(...[...have].map((n) => all.indexOf(n)));
  return top >= 0 && all.slice(0, top + 1).every((n) => have.has(n));
}

function orbitalText(m: OrbitalModel, printed: string[], out: string[]): string {
  out.push(`${m.diagrams.length === 1 ? 'One orbital diagram' : `${plural(m.diagrams.length, 'orbital diagram')}, one under the other`}: each box is one orbital; an arrow in a box is one electron (pointing up or down).${m.layout === 'ladder' ? ' The subshells are drawn as rows that rise in the order listed, beside an upward arrow labelled "Energy".' : ''}`);
  if (m.layout === 'ladder') printed.push('axis label: "Energy"');
  m.diagrams.forEach((d, i) => {
    if (d.label) printed.push(`diagram label: "${d.label}"`);
    if (d.core) printed.push(`core: "[${d.core}]"`);
    const subs = m.layout === 'ladder' ? d.subshells.slice().sort(madelung) : d.subshells;
    const groups = subs.map((s) => {
      if (m.subshellLabels === 'value') printed.push(`subshell label: "${s.name}"`);
      return `${m.subshellLabels === 'value' ? `"${s.name}"` : `a group of ${plural(s.boxes.length, 'box', 'boxes')}`}: ${s.boxes.map((b) => BOX_WORDS[b]).join(' ')}`;
    });
    out.push(`  ${d.label ? `the diagram labelled "${d.label}"` : m.diagrams.length > 1 ? `diagram ${i + 1} (no label)` : 'the diagram'}${d.core ? `, after the printed core "[${d.core}]"` : ''} — ${groups.join('; ')}.`);
  });
  return 'an orbital box diagram';
}

// ── level ladders ───────────────────────────────────────────────────────────

const HC_EV_NM = 1239.84;
const H_EV_S = 4.135668e-15;
const H_J_S = 6.62607e-34;
const C_M_S = 2.99792e8;

const energyLabel = (m: LevelsModel, l: Level): string => `${minus(l.energy)} ${m.units}`;
const ordinal = (k: number): string => `${k}${k % 10 === 1 && k !== 11 ? 'st' : k % 10 === 2 && k !== 12 ? 'nd' : k % 10 === 3 && k !== 13 ? 'rd' : 'th'}`;
const levelWord = (m: LevelsModel, k: number): string => {
  const l = m.levels[k - 1];
  return m.levelLabels === 'value' && l.label ? `the level labelled "${l.label}"` : `the ${k === 1 ? 'lowest' : `${ordinal(k)}-lowest`} level`;
};
/** Can a reader know the energy of level k? Printed, or a hydrogen level whose n is printed. */
const energyKnown = (m: LevelsModel, k: number): boolean => m.levels[k - 1].show === 'value' || (m.hydrogen && m.levelLabels === 'value');
function transitionArg(m: LevelsModel, a: P): { from: number; to: number; label?: string } {
  if (m.transitions.length === 0) return fail('the figure has no transition arrows');
  if (typeof a.transition === 'string') {
    const hits = m.transitions.filter((t) => t.label === (a.transition as string).trim());
    if (hits.length !== 1) return fail(`derivation argument "transition": ${hits.length === 0 ? 'no' : 'more than one'} arrow is labelled "${a.transition}"`);
    return hits[0];
  }
  return m.transitions[argIndex(a, 'transition', m.transitions.length, 'transition arrow')];
}
function gap(m: LevelsModel, t: { from: number; to: number }): number {
  for (const k of [t.from, t.to]) if (!energyKnown(m, k)) fail(`the energy of ${levelWord(m, k)} is not printed on the figure${m.levels[k - 1].show === 'blank' ? ' (a "?" box)' : ''} — the transition energy cannot be read off it`);
  return Math.abs(m.levels[t.from - 1].energy - m.levels[t.to - 1].energy);
}
function photon(m: LevelsModel, dE: number): { nm: number; hz: number } {
  if (m.units === 'eV') return { nm: HC_EV_NM / dE, hz: dE / H_EV_S };
  if (m.units === 'J') return { nm: ((H_J_S * C_M_S) / dE) * 1e9, hz: dE / H_J_S };
  return fail(`the photon's wavelength and frequency are worked out for energies in eV or J, not "${m.units}"`);
}

function levelsText(m: LevelsModel, printed: string[], out: string[]): string {
  const lay = levelsLayout(m);
  const axis = `${m.axisLabel}${m.units && !/\(/.test(m.axisLabel) ? ` (${m.units})` : ''}`;
  printed.push(`axis label: "${axis}"`);
  out.push(`An energy-level diagram: ${plural(m.levels.length, 'horizontal line')}, one per level, beside an upward arrow labelled "${axis}". ${lay.toScale ? 'The lines are spaced in proportion to their energies.' : 'The lines are evenly spaced, and "not to scale" is printed under them.'}`);
  if (!lay.toScale) printed.push('note: "not to scale"');
  out.push('The levels, from the lowest up:');
  m.levels.forEach((l, i) => {
    if (m.levelLabels === 'value' && l.label) printed.push(`level label: "${l.label}"`);
    if (l.show === 'value') printed.push(`energy label: "${energyLabel(m, l)}"`);
    out.push(`  ${i + 1}. ${m.levelLabels === 'value' && l.label ? `labelled "${l.label}" on the left` : 'no label on the left'}; ${l.show === 'value' ? `energy "${energyLabel(m, l)}" printed on the right` : l.show === 'blank' ? `its energy is ${BLANK}` : 'no energy printed'}.`);
  });
  if (m.ionization) {
    if (m.levelLabels === 'value') printed.push('level label: "n = ∞"');
    printed.push(`energy label: "0 ${m.units}"`);
    out.push(`  Above them a dashed line${m.levelLabels === 'value' ? ' labelled "n = ∞"' : ''} at "0 ${m.units}".`);
  }
  if (m.transitions.length) out.push(`${plural(m.transitions.length, 'vertical arrow')} between levels:`);
  for (const t of m.transitions) {
    if (t.label) printed.push(`arrow label: "${t.label}"`);
    out.push(`  ${t.label ? `the arrow labelled "${t.label}"` : 'an unlabelled arrow'} points ${t.from > t.to ? 'down' : 'up'} from ${levelWord(m, t.from)} to ${levelWord(m, t.to)}.`);
  }
  return 'an energy-level diagram';
}

// ── heating curves ──────────────────────────────────────────────────────────

const HEATING_ORDER = ['solid', 'melting', 'liquid', 'boiling', 'gas'] as const;
/** What each segment is, when the curve settles it: computed curves say; a five-segment curve through corners is solid → gas (or the reverse). */
function segmentKinds(m: HeatingModel): string[] | null {
  if (m.computed) return m.segments.map((s) => s.kind);
  const shape = m.segments.map((s) => (isPlateau(s) ? 'f' : 's')).join('');
  if (shape !== 'sfsfs') return null;
  return m.cooling ? ['gas', 'condensing', 'liquid', 'freezing', 'solid'] : [...HEATING_ORDER];
}
const STATE_OF: Record<string, string> = { solid: 'solid', liquid: 'liquid', gas: 'gas', melting: 'solid and liquid', freezing: 'solid and liquid', boiling: 'liquid and gas', condensing: 'liquid and gas' };
function segmentArg(m: HeatingModel, a: P): number {
  if (typeof a.segment === 'string') {
    const hits = m.segments.map((s, i) => (s.label === (a.segment as string).trim() ? i : -1)).filter((i) => i >= 0);
    if (hits.length !== 1) return fail(`derivation argument "segment": ${hits.length === 0 ? 'no' : 'more than one'} segment is labelled "${a.segment}"`);
    return hits[0];
  }
  return argIndex(a, 'segment', m.segments.length, 'segment');
}
const onHalfStep = (v: number, step: number): boolean => Math.abs(v / (step / 2) - Math.round(v / (step / 2))) < 1e-6;
const xUnitOf = (m: HeatingModel): string => (m.xQuantity === 'time' ? m.timeUnit : m.heatUnit);
/** The x-extent of a segment as a reader gets it: needs a numbered x axis and corners on (half-)gridlines — or `fromData` on a computed curve. */
function extent(m: HeatingModel, s: HeatSegment, a: P): number {
  const fromData = a.fromData === true;
  if (fromData && !m.computed) fail('fromData: the curve was given by its corners — there are no substance data to work from');
  if (!fromData) {
    if (!m.xNumbers) fail('the horizontal axis has no numbers — an amount cannot be read off it');
    for (const x of [s.x0, s.x1]) if (!onHalfStep(x, m.xStep)) fail(`a corner of the segment is at ${fmt(Number(x.toPrecision(6)))} ${xUnitOf(m)}, between gridlines — it cannot be read exactly (put the corners on gridlines, or pass fromData: true when the stem gives the substance's data)`);
  }
  return s.x1 - s.x0;
}
function heatOf(m: HeatingModel, dx: number): number {
  if (m.heatPerX === undefined) return fail('the horizontal axis is time and no heating power is given — a heat cannot be worked out');
  return dx * m.heatPerX;
}
function tempReadable(m: HeatingModel, t: number, plateau: boolean): void {
  if (plateau && m.plateauLabels === 'value') return;
  if (plateau && m.plateauLabels === 'blank' && !m.yNumbers) fail('the plateau temperature is a "?" box and the temperature axis has no numbers');
  if (!m.yNumbers) fail('the temperature axis has no numbers and the temperature is not printed');
  if (!onHalfStep(t, m.yStep)) fail(`${fmt(t)} ${m.tempUnit} lies between gridlines — it cannot be read exactly`);
}

function heatingText(m: HeatingModel, printed: string[], out: string[]): string {
  printed.push(`axis label: "${m.xLabel}"`, `axis label: "${m.yLabel}"`);
  const xa = m.xNumbers ? `numbered from ${fmt(m.xRange[0])} to ${fmt(m.xRange[1])} in steps of ${fmt(m.xStep)}` : 'without numbers';
  const ya = m.yNumbers ? `numbered from ${minus(m.yRange[0])} to ${minus(m.yRange[1])} in steps of ${fmt(m.yStep)}` : 'without numbers';
  out.push(`A ${m.cooling ? 'cooling' : 'heating'} curve: horizontal axis "${m.xLabel}" ${xa}; vertical axis "${m.yLabel}" ${ya}.`);
  out.push(`One line of ${plural(m.segments.length, 'straight segment')}, left to right:`);
  const pt = (x: number, t: number): string => `(${m.xNumbers ? fmt(Number(x.toPrecision(6))) : '·'}, ${m.yNumbers ? minus(t) : '·'})`;
  m.segments.forEach((s, i) => {
    if (s.label) printed.push(`segment label: "${s.label}"`);
    const flat = isPlateau(s);
    const where = m.xNumbers || m.yNumbers ? ` from ${pt(s.x0, s.t0)} to ${pt(s.x1, s.t1)}` : '';
    let plate = '';
    if (flat && m.plateauLabels !== 'none') {
      const v = `${minus(s.t0, 2)} ${m.tempUnit}`;
      if (m.plateauLabels === 'value') printed.push(`plateau label: "${v}"`);
      plate = m.plateauLabels === 'value' ? `; "${v}" is printed under it` : `; its temperature is ${BLANK}`;
    }
    out.push(`  ${i + 1}. ${s.label ? `labelled "${s.label}"` : 'no label'}: ${flat ? 'flat' : s.t1 > s.t0 ? 'rises' : 'falls'}${where}${plate}.`);
  });
  for (const mk of m.marks) {
    if (mk.label) printed.push(`point label: "${mk.label}"`);
    const k = m.segments.findIndex((s) => mk.x >= s.x0 && mk.x <= s.x1);
    out.push(`A dot on the curve${mk.label ? ` labelled "${mk.label}"` : ''}, on segment ${k + 1}${m.xNumbers ? ` at ${fmt(mk.x)} on the horizontal axis` : ''}.`);
  }
  return `a ${m.cooling ? 'cooling' : 'heating'} curve (temperature against ${m.xQuantity === 'time' ? 'time' : m.cooling ? 'heat removed' : 'heat added'})`;
}

// ── electrochemical cells ───────────────────────────────────────────────────

const F = 96485;
const other = (s: Side): Side => (s === 'left' ? 'right' : 'left');
function potentials(a: P): { left: number; right: number } | null {
  if (a.leftE === undefined && a.rightE === undefined) return null;
  if (!isNum(a.leftE) || !isNum(a.rightE)) return fail('derivation arguments "leftE" and "rightE" must both be given: the standard reduction potentials (V) of the left and the right half-cell');
  return { left: a.leftE, right: a.rightE };
}
/** The anode a reader can work out: shown by the drawing, or (galvanic) the half-cell of lower reduction potential. */
function anodeOf(m: CellModel, a: P): Side {
  const e = potentials(a);
  if (e && m.variant === 'galvanic') {
    if (e.left === e.right) fail('the two reduction potentials are equal — no cell runs');
    const lower: Side = e.left < e.right ? 'left' : 'right';
    if (lower !== m.anode) fail(`the figure's anode is the ${m.anode} electrode, but the ${lower} half-cell has the lower reduction potential — a galvanic cell would run the other way; fix "anode" or the potentials`);
    return m.anode;
  }
  if (!showsAnode(m)) fail('nothing on the figure shows which electrode is the anode (no roles, electron arrow, signs or ion arrows) — pass the reduction potentials leftE and rightE');
  return m.anode;
}
function electrodeName(m: CellModel, s: Side): string {
  const n = m[s].electrode;
  return n === '?' ? fail(`the ${s} electrode's name is a "?" box on the figure`) : n;
}

function cellText(m: CellModel, printed: string[], out: string[]): string {
  const two = m.container === 'two';
  out.push(two
    ? `Two beakers of solution side by side, an upright electrode standing in each, joined by an inverted-U tube (a salt bridge)${m.saltBridge ? ` labelled "${m.saltBridge}"` : ''}. A wire joins the tops of the electrodes through ${m.variant === 'galvanic' ? 'a voltmeter (a circle marked "V")' : 'a battery'}.`
    : `One container of liquid with two upright electrodes standing in it. A wire joins the tops of the electrodes through ${m.variant === 'galvanic' ? 'a voltmeter (a circle marked "V")' : 'a battery'}.`);
  if (m.saltBridge) printed.push(`label: "${m.saltBridge}"`);
  if (m.variant === 'galvanic') printed.push('meter: "V"');
  for (const s of ['left', 'right'] as const) {
    const h = m[s];
    if (h.electrode !== '?') printed.push(`electrode label: "${h.electrode}"`);
    if (h.solution && h.solution !== '?') printed.push(`solution label: "${h.solution}"`);
    const bits = [`electrode labelled ${shown(h.electrode)}`];
    if (two) bits.push(h.solution ? `solution labelled ${shown(h.solution)} under the beaker` : 'solution not labelled');
    if (m.roles === 'value') { bits.push(`"${m.anode === s ? 'anode' : 'cathode'}" printed over it`); printed.push(`role label: "${m.anode === s ? 'anode' : 'cathode'}"`); }
    if (m.roles === 'blank') bits.push(`the label over it is ${BLANK}`);
    if (m.polarity === 'value' && m.variant === 'galvanic') bits.push(`marked "${positiveSide(m) === s ? '+' : '−'}"`);
    out.push(`  ${s === 'left' ? 'Left' : 'Right'}: ${bits.join('; ')}.`);
  }
  if (!two) out.push(`  The liquid is ${m.left.solution ? `labelled ${shown(m.left.solution)}` : 'not labelled'}.`);
  if (m.polarity === 'value') printed.push('sign: "+"', 'sign: "−"');
  if (m.variant === 'electrolytic') {
    out.push(`  The battery is drawn as a long thin plate and a short thick plate; the long thin plate (the positive terminal) is on the side of the ${positiveSide(m)} electrode${m.polarity === 'value' ? ', and the terminals are marked "+" and "−"' : ''}.`);
  }
  if (m.meterLabel) {
    if (m.meterLabel !== '?') printed.push(`meter reading: "${m.meterLabel}"`);
    out.push(`  Under the voltmeter: ${shown(m.meterLabel)}.`);
  }
  if (m.electronFlow !== 'none') {
    printed.push('label: "e⁻"');
    out.push(m.electronFlow === 'value'
      ? `  An arrow labelled "e⁻" lies along the wire, pointing from the ${m.anode} electrode toward the ${other(m.anode)} electrode.`
      : `  Over the wire, "e⁻" is printed beside ${BLANK}: the direction of electron flow is not shown.`);
  }
  if (m.bridgeIons) {
    for (const [ion, to] of [[m.bridgeIons.anion, m.anode], [m.bridgeIons.cation, other(m.anode)]] as const) {
      if (!ion) continue;
      printed.push(`ion label: "${ion}"`);
      out.push(`  Under the salt bridge, "${ion}" with an arrow pointing toward the ${to} beaker.`);
    }
  }
  return m.variant === 'galvanic' ? 'a galvanic cell (an apparatus sketch)' : 'an electrolytic cell (an apparatus sketch)';
}

// ── the part ────────────────────────────────────────────────────────────────

function describe(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  switch (spec.type) {
    case 'energy_levels': {
      const m = modelOf(spec, energyLevelsModel);
      if (m.title) printed.push(`title: "${m.title}"`);
      return m.variant === 'orbital_boxes' ? orbitalText(m, printed, out) : levelsText(m, printed, out);
    }
    case 'heating_curve': {
      const m = modelOf(spec, heatingModel);
      if (m.title) printed.push(`title: "${m.title}"`);
      return heatingText(m, printed, out);
    }
    case 'electrochemical_cell': {
      const m = modelOf(spec, cellModel);
      if (m.title) printed.push(`title: "${m.title}"`);
      return cellText(m, printed, out);
    }
    default: return '';
  }
}

const checkers: Record<string, Batch4CheckerDef> = {
  // energy_levels — orbital boxes
  orbital_count: {
    kinds: ['energy_levels'], args: '{ want: electrons | unpaired | paired_orbitals | empty_orbitals, diagram?: index or label (0) }',
    returns: 'a count over one orbital diagram (electrons include a printed noble-gas core; orbitals are those drawn) — refused when a box is a "?"',
    run: (s, a) => {
      const d = diagramArg(orbitalOf(s), a);
      noBlank(d);
      const want = pick(a, 'want', ['electrons', 'unpaired', 'paired_orbitals', 'empty_orbitals'] as const);
      const boxes = d.subshells.flatMap((x) => x.boxes);
      return num(want === 'electrons' ? electronsIn(d) : want === 'unpaired' ? unpairedIn(d) : want === 'paired_orbitals' ? boxes.filter((b) => b === 'ud').length : boxes.filter((b) => b === '').length);
    },
  },
  orbital_configuration: {
    kinds: ['energy_levels'], args: '{ diagram?: index or label (0), style?: superscript | plain (superscript) }',
    returns: 'the electron configuration the diagram shows, subshells in the order drawn, empty ones left out: "1s² 2s² 2p³" (plain: "1s2 2s2 2p3"; a printed core leads: "[Ar] 4s² 3d¹⁰ 4p³")',
    run: (s, a) => {
      const d = diagramArg(orbitalOf(s), a);
      noBlank(d);
      const style = pick(a, 'style', ['superscript', 'plain'] as const, 'superscript');
      const parts = d.subshells.map((x) => ({ name: x.name, e: x.boxes.reduce((t, b) => t + b.length, 0) })).filter((x) => x.e > 0)
        .map((x) => `${x.name}${style === 'plain' ? x.e : [...String(x.e)].map((c) => SUPER[Number(c)]).join('')}`);
      return text([...(d.core ? [`[${d.core}]`] : []), ...parts].join(' '));
    },
  },
  orbital_element: {
    kinds: ['energy_levels'], args: '{ diagram?: index or label (0), as?: name | symbol (name) }',
    returns: 'the neutral atom with that many electrons (hydrogen to krypton) — refused when a box is a "?" or the diagram does not start from 1s (or a printed core)',
    run: (s, a) => {
      const d = diagramArg(orbitalOf(s), a);
      noBlank(d);
      if (!startsAtTheBottom(d)) fail('the diagram leaves out a lower subshell — its electrons cannot be counted from the figure');
      const z = electronsIn(d);
      if (z < 1 || z > 36) return fail(`${z} electrons — outside hydrogen to krypton`);
      return pick(a, 'as', ['name', 'symbol'] as const, 'name') === 'name' ? label(ELEMENT_NAMES[z - 1]) : text(ELEMENTS[z - 1]);
    },
  },
  orbital_violation: {
    kinds: ['energy_levels'], args: '{ diagram?: index or label (0) }',
    returns: 'the rule the diagram breaks — "Pauli exclusion principle" (two like arrows in a box), "Aufbau principle" (a higher subshell holds electrons while a lower one drawn is not full; Cr and Cu excepted) or "Hund\'s rule" (a pair beside an empty box, or unlike single arrows in a subshell) — refused for a valid ground state and when it breaks more than one',
    run: (s, a) => {
      const d = diagramArg(orbitalOf(s), a);
      noBlank(d);
      const v = orbitalViolation(d);
      if (v === null) return fail('the diagram is a valid ground-state filling — it breaks no rule');
      // More than one rule broken: the question would have two answers.
      const pauliFree: OrbitalDiagram = { ...d, subshells: d.subshells.map((x) => ({ ...x, boxes: x.boxes.map((b) => (b === 'uu' || b === 'dd' ? 'ud' : b)) })) };
      if (v === 'Pauli exclusion principle' && orbitalViolation(pauliFree) !== null) return fail('the diagram breaks more than one rule — draw one mistake per diagram');
      if (v === 'Aufbau principle') {
        const hund = d.subshells.some((x) => (x.boxes.includes('ud') && x.boxes.includes('')) || new Set(x.boxes.filter((b) => b === 'u' || b === 'd')).size > 1);
        if (hund) return fail('the diagram breaks more than one rule — draw one mistake per diagram');
      }
      return label(v);
    },
  },
  orbital_ground_state: {
    kinds: ['energy_levels'], args: '{}',
    returns: 'the label of the ONE diagram that is a valid ground-state filling (Pauli, Aufbau and Hund all kept) — refused unless exactly one is, or it has no label',
    run: (s) => {
      const m = orbitalOf(s);
      m.diagrams.forEach(noBlank);
      const ok = m.diagrams.filter((d) => orbitalViolation(d) === null);
      if (ok.length !== 1) return fail(`${ok.length} of the ${m.diagrams.length} diagrams are valid ground states — the figure does not single one out`);
      return ok[0].label ? text(ok[0].label) : fail('the valid diagram has no label to answer with');
    },
  },
  // energy_levels — levels
  level_transition_energy: {
    kinds: ['energy_levels'], args: '{ transition: index or label }',
    returns: 'the size of the energy change of one transition, in the figure\'s units — refused when either level\'s energy is not printed (hydrogen levels labelled with n count as known: −13.6 eV / n², three significant figures)',
    run: (s, a) => { const m = levelsOf(s); return measured(gap(m, transitionArg(m, a))); },
  },
  level_photon: {
    kinds: ['energy_levels'], args: '{ transition: index or label, want: wavelength_nm | frequency_1e14_Hz }',
    returns: 'the photon of the transition, rounded: its wavelength in nm (hc = 1239.84 eV·nm) or its frequency in units of 10¹⁴ Hz (h = 4.135668 × 10⁻¹⁵ eV·s); energies in eV or J only',
    run: (s, a) => {
      const m = levelsOf(s);
      const ph = photon(m, gap(m, transitionArg(m, a)));
      return approx(pick(a, 'want', ['wavelength_nm', 'frequency_1e14_Hz'] as const) === 'wavelength_nm' ? ph.nm : ph.hz / 1e14);
    },
  },
  level_extreme_transition: {
    kinds: ['energy_levels'], args: '{ want: largest_energy | smallest_energy | shortest_wavelength | longest_wavelength | highest_frequency | lowest_frequency, among?: emission | absorption | all (all) }',
    returns: 'the label of the transition arrow with that extreme — refused on a tie, when an energy needed is hidden, or when the arrow has no label',
    run: (s, a) => {
      const m = levelsOf(s);
      const want = pick(a, 'want', ['largest_energy', 'smallest_energy', 'shortest_wavelength', 'longest_wavelength', 'highest_frequency', 'lowest_frequency'] as const);
      const among = pick(a, 'among', ['emission', 'absorption', 'all'] as const, 'all');
      const pool = m.transitions.filter((t) => among === 'all' || (among === 'emission') === (t.from > t.to));
      if (pool.length < 2) return fail(`there ${pool.length === 1 ? 'is one transition' : 'are no transitions'} to compare`);
      const big = want === 'largest_energy' || want === 'shortest_wavelength' || want === 'highest_frequency';
      const gaps = pool.map((t) => gap(m, t));
      const best = big ? Math.max(...gaps) : Math.min(...gaps);
      const hits = pool.filter((_, i) => Math.abs(gaps[i] - best) < 1e-9);
      if (hits.length !== 1) return fail('two transitions tie for that extreme');
      return hits[0].label ? text(hits[0].label) : fail('that transition has no label to answer with');
    },
  },
  level_transition_kind: {
    kinds: ['energy_levels'], args: '{ transition: index or label }',
    returns: '"emission" (the arrow points down: a photon is given out) or "absorption" (the arrow points up)',
    run: (s, a) => { const t = transitionArg(levelsOf(s), a); return label(t.from > t.to ? 'emission' : 'absorption'); },
  },
  level_energy: {
    kinds: ['energy_levels'], args: '{ level: number (1 = the lowest; for hydrogen, n) }',
    returns: 'the energy of one level of a HYDROGEN ladder whose n labels are printed: −13.6 eV / n², to three significant figures — this is how a "?" energy is recomputed; refused for any other ladder',
    run: (s, a) => {
      const m = levelsOf(s);
      const k = argNum(a, 'level');
      if (!Number.isInteger(k) || k < 1 || k > m.levels.length) return fail(`derivation argument "level" must be a level number from 1 to ${m.levels.length}`);
      if (!m.hydrogen || m.levelLabels !== 'value') return fail('only a hydrogen ladder with its n labels printed lets a level\'s energy be worked out (−13.6 eV / n²)');
      return num(m.levels[k - 1].energy);
    },
  },
  // heating_curve
  heating_segment: {
    kinds: ['heating_curve'], args: '{ segment: index or label, want: state | process }',
    returns: 'state: what is present on the segment — "solid", "solid and liquid", "liquid", "liquid and gas" or "gas"; process: the change of state on a FLAT segment — "melting", "boiling", "freezing" or "condensing". Needs a computed curve or a five-segment one (slope, flat, slope, flat, slope). An option that merely contains the word (e.g. "solid and liquid" beside the key "liquid") counts as stating it too.',
    run: (s, a) => {
      const m = modelOf(s, heatingModel);
      const kinds = segmentKinds(m);
      if (!kinds) return fail('the curve does not show both changes of state (slope, flat, slope, flat, slope) — which one a plateau is cannot be told from the figure');
      const k = kinds[segmentArg(m, a)];
      if (pick(a, 'want', ['state', 'process'] as const) === 'state') return label(STATE_OF[k]);
      return STATE_OF[k].includes(' and ') ? label(k) : fail('that segment is a single phase warming or cooling — ask for its state, not a change of state');
    },
  },
  heating_segment_for: {
    kinds: ['heating_curve'], args: '{ want: solid | melting | liquid | boiling | gas | freezing | condensing }',
    returns: 'the label of the segment on which that is happening — refused when the segment has no label or the curve does not settle it',
    run: (s, a) => {
      const m = modelOf(s, heatingModel);
      const kinds = segmentKinds(m);
      if (!kinds) return fail('the curve does not show both changes of state — its segments cannot be named from the figure');
      const want = pick(a, 'want', ['solid', 'melting', 'liquid', 'boiling', 'gas', 'freezing', 'condensing'] as const);
      const i = kinds.indexOf(want);
      if (i < 0) return fail(`no segment of this ${m.cooling ? 'cooling' : 'heating'} curve is "${want}"`);
      const l = m.segments[i].label;
      return l ? text(l) : fail('that segment has no label to answer with');
    },
  },
  heating_point: {
    kinds: ['heating_curve'], args: '{ want: melting_point | boiling_point }',
    returns: 'the temperature of that plateau (freezing point = melting point, condensation point = boiling point) — refused when it is neither printed nor on a (half-)gridline of a numbered axis',
    run: (s, a) => {
      const m = modelOf(s, heatingModel);
      const kinds = segmentKinds(m);
      if (!kinds) return fail('the curve does not show both changes of state — which plateau is which cannot be told from the figure');
      const want = pick(a, 'want', ['melting_point', 'boiling_point'] as const);
      const i = kinds.findIndex((k) => (want === 'melting_point' ? k === 'melting' || k === 'freezing' : k === 'boiling' || k === 'condensing'));
      if (i < 0) return fail(`the curve has no ${want === 'melting_point' ? 'melting' : 'boiling'} plateau`);
      tempReadable(m, m.segments[i].t0, true);
      return num(m.segments[i].t0);
    },
  },
  heating_heat: {
    kinds: ['heating_curve'], args: '{ segment?: index or label (omit for the whole curve), fromData?: boolean }',
    returns: 'the heat added (or removed) over one segment or the whole curve, in the figure\'s heat unit — read off a numbered axis with the corners on (half-)gridlines; `fromData: true` instead takes it from the substance data of a computed curve (rounded); on a time axis it needs `power`',
    run: (s, a) => {
      const m = modelOf(s, heatingModel);
      const segs = a.segment === undefined ? m.segments : [m.segments[segmentArg(m, a)]];
      const q = segs.reduce((t, g) => t + heatOf(m, extent(m, g, a)), 0);
      return a.fromData === true ? approx(q) : measured(q);
    },
  },
  heating_time: {
    kinds: ['heating_curve'], args: '{ segment: index or label }',
    returns: 'how long one segment lasts, in the figure\'s time unit — a time axis with numbers and corners on (half-)gridlines only',
    run: (s, a) => {
      const m = modelOf(s, heatingModel);
      if (m.xQuantity !== 'time') return fail('the horizontal axis is heat, not time');
      return measured(extent(m, m.segments[segmentArg(m, a)], {}));
    },
  },
  heating_specific_heat: {
    kinds: ['heating_curve'], args: '{ segment: index or label, mass: number (g) }',
    returns: 'the specific heat capacity on a SLOPED segment, in J/(g·°C): heat ÷ (mass × temperature change), heat and temperatures read off the numbered axes (rounded)',
    run: (s, a) => {
      const m = modelOf(s, heatingModel);
      const g = m.segments[segmentArg(m, a)];
      if (isPlateau(g)) return fail('that segment is flat — the temperature does not change on it');
      const mass = argNum(a, 'mass');
      if (!(mass > 0)) return fail('derivation argument "mass" must be greater than 0');
      tempReadable(m, g.t0, false);
      tempReadable(m, g.t1, false);
      const q = heatOf(m, extent(m, g, {})) * (m.heatUnit === 'kJ' ? 1000 : 1);
      return approx(q / (mass * Math.abs(g.t1 - g.t0)));
    },
  },
  heating_latent_heat: {
    kinds: ['heating_curve'], args: '{ segment: index or label, mass: number (g) }',
    returns: 'the heat of fusion or vaporization from a FLAT segment, in J/g: heat ÷ mass, the heat read off the numbered axis (rounded)',
    run: (s, a) => {
      const m = modelOf(s, heatingModel);
      const g = m.segments[segmentArg(m, a)];
      if (!isPlateau(g)) return fail('that segment is sloped — a latent heat is read from a flat one');
      const mass = argNum(a, 'mass');
      if (!(mass > 0)) return fail('derivation argument "mass" must be greater than 0');
      return approx((heatOf(m, extent(m, g, {})) * (m.heatUnit === 'kJ' ? 1000 : 1)) / mass);
    },
  },
  // electrochemical_cell
  cell_electrode: {
    kinds: ['electrochemical_cell'], args: '{ want: anode | cathode | positive | negative, leftE?: number, rightE?: number }',
    returns: 'the printed name of that electrode. Which is the anode must be shown by the figure (electron arrow, signs, ion arrows, printed roles, or the battery of an electrolytic cell) or follow from the two standard reduction potentials leftE / rightE (V) of a galvanic cell (the lower one is oxidised). Positive electrode: the cathode of a galvanic cell, the anode of an electrolytic one.',
    run: (s, a) => {
      const m = modelOf(s, cellModel);
      const an = anodeOf(m, a);
      const want = pick(a, 'want', ['anode', 'cathode', 'positive', 'negative'] as const);
      const pos = m.variant === 'galvanic' ? other(an) : an;
      return label(electrodeName(m, want === 'anode' ? an : want === 'cathode' ? other(an) : want === 'positive' ? pos : other(pos)));
    },
  },
  cell_electron_flow: {
    kinds: ['electrochemical_cell'], args: '{ leftE?: number, rightE?: number }',
    returns: 'the direction of electron flow in the wire as "<anode name> to <cathode name>" (e.g. "Zn to Cu") — refused when the arrow is printed on the figure, and when nothing settles which electrode is the anode',
    run: (s, a) => {
      const m = modelOf(s, cellModel);
      if (m.electronFlow === 'value') return fail('the electron arrow is printed on the figure — the question would be answered by the figure itself; set electronFlow to "blank" or "none"');
      const an = anodeOf(m, a);
      return label(`${electrodeName(m, an)} to ${electrodeName(m, other(an))}`);
    },
  },
  cell_ion_migration: {
    kinds: ['electrochemical_cell'], args: '{ ion: anion | cation, leftE?: number, rightE?: number }',
    returns: 'the name of the electrode whose half-cell (or which electrode, in one container) those ions move toward: anions toward the anode, cations toward the cathode — refused when the ion arrows are printed',
    run: (s, a) => {
      const m = modelOf(s, cellModel);
      if (m.bridgeIons) return fail('the ion arrows are printed on the figure — the question would be answered by the figure itself');
      const ion = pick(a, 'ion', ['anion', 'cation'] as const);
      const an = anodeOf(m, a);
      return label(electrodeName(m, ion === 'anion' ? an : other(an)));
    },
  },
  cell_potential: {
    kinds: ['electrochemical_cell'], args: '{ leftE: number, rightE: number }',
    returns: 'E°cell in volts = E°(cathode) − E°(anode), from the standard REDUCTION potentials of the left and right half-cells: positive for a galvanic cell (refused when the figure\'s anode is not the lower one); for an electrolytic cell the negative value (its size is the least voltage to apply) — refused when a voltmeter reading is printed',
    run: (s, a) => {
      const m = modelOf(s, cellModel);
      if (m.meterLabel && m.meterLabel !== '?') return fail('a voltmeter reading is printed on the figure');
      const e = potentials(a) ?? fail('derivation arguments "leftE" and "rightE" (standard reduction potentials, V) are needed');
      const an = anodeOf(m, a);
      return num(Number((e[other(an)] - e[an]).toFixed(6)));
    },
  },
  cell_delta_g: {
    kinds: ['electrochemical_cell'], args: '{ leftE: number, rightE: number, n: number }',
    returns: 'ΔG° in kJ per mole of reaction = −nFE°cell, F = 96 485 C/mol, n = moles of electrons transferred (rounded)',
    run: (s, a) => {
      const m = modelOf(s, cellModel);
      const e = potentials(a) ?? fail('derivation arguments "leftE" and "rightE" (standard reduction potentials, V) are needed');
      const n = argNum(a, 'n');
      if (!Number.isInteger(n) || n < 1 || n > 12) return fail('derivation argument "n" must be a whole number of electrons from 1 to 12');
      const an = anodeOf(m, a);
      return approx((-n * F * (e[other(an)] - e[an])) / 1000);
    },
  },
  cell_mass_deposited: {
    kinds: ['electrochemical_cell'], args: '{ current: number (A), time: number (s), n: number, molarMass: number (g/mol) }',
    returns: 'the mass in grams plated at the cathode of an ELECTROLYTIC cell: current × time ÷ (n × 96 485 C/mol) × molar mass (rounded)',
    run: (s, a) => {
      const m = modelOf(s, cellModel);
      if (m.variant !== 'electrolytic') return fail('Faraday\'s-law masses are for an electrolytic cell');
      const [i, t, n, mm] = [argNum(a, 'current'), argNum(a, 'time'), argNum(a, 'n'), argNum(a, 'molarMass')];
      if (!(i > 0 && t > 0 && mm > 0) || !Number.isInteger(n) || n < 1) return fail('current, time and molarMass must be positive and n a whole number of electrons');
      return approx(((i * t) / (n * F)) * mm);
    },
  },
};

export const PART: Batch4Part = {
  kinds: ['energy_levels', 'heating_curve', 'electrochemical_cell'],
  describe,
  checkers,
};

export type { Derived };
