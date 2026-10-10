/**
 * Batch 5, part "bio" (replication_fork, operon_map, cell_cycle_wheel): the
 * TEXT transcription and the deterministic checkers. Conventions:
 * figure-core-batch4-kit.ts.
 *
 * What a figure SETTLES:
 *   - replication_fork — which new strand is continuous and which is in
 *     pieces (always drawn); which way the strands run, once one end is
 *     printed or the new strands carry arrowheads; where each marker sits.
 *     A transcription never NAMES a strand or an enzyme the figure does not
 *     name: it says "the continuous new strand", "a wedge in the mouth of the
 *     fork".
 *   - operon_map — the state is computed from the conditions by the model the
 *     renderer draws from (lac: the repressor binds unless allolactose is on
 *     it, CAP binds when glucose is absent; trp: the repressor binds only
 *     with tryptophan on it). A checker can also recompute the state under
 *     CHANGED conditions (the question must state them).
 *   - cell_cycle_wheel — a printed duration; a hidden one only as the printed
 *     cycle length minus the other printed durations. A sector's width is
 *     never measured.
 *
 * Pure: no I/O, no network, no model, no database.
 */
import '../lib/no-db-env';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { END_TRUTH, ENZYME_NAME, FORK_ENDS, FORK_ENZYMES, forkModel, forkPolaritySettled, type ForkEnd, type ForkEnzyme, type ForkModel } from '../../src/lib/tutor/practice-figure/kinds/replication-fork';
import { LEVEL_TEXT, operonConditions, operonDrawn, operonModel, type OperonModel } from '../../src/lib/tutor/practice-figure/kinds/operon-map';
import { cycleModel, type CycleModel, type CyclePhase } from '../../src/lib/tutor/practice-figure/kinds/cell-cycle';
import { BLANK, argNum, argStr, fail, fmt, label, measured, modelOf, num, pick, plural, shown, text, type Batch4CheckerDef, type Batch4Part, type P } from './figure-core-batch4-kit';

// ── replication_fork ────────────────────────────────────────────────────────

const END_WORDS: Record<ForkEnd, string> = {
  template_leading_open: 'the open end of the parental strand that the continuous new strand lies along',
  template_leading_parental: 'the end, in the unopened duplex, of the parental strand that the continuous new strand lies along',
  template_lagging_open: 'the open end of the parental strand that the new strand in pieces lies along',
  template_lagging_parental: 'the end, in the unopened duplex, of the parental strand that the new strand in pieces lies along',
  leading_start: 'the end of the continuous new strand far from the fork',
  leading_tip: 'the end of the continuous new strand nearest the fork',
  lagging_start: 'the end, nearest the fork, of the piece nearest the fork',
  lagging_tip: 'the end, far from the fork, of the piece farthest from the fork',
};
const MARKER_WORDS: Record<ForkEnzyme, string> = {
  helicase: 'a wedge in the mouth of the fork, where the two parental strands part',
  polymerase: 'a disc on the continuous new strand, at its growing end',
  primase: 'a square on the parental strand of the new strand in pieces, where the piece nearest the fork begins',
  ligase: 'a diamond over the gap between the two pieces farthest from the fork',
};

function describeFork(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  const m = modelOf(spec, forkModel);
  const duplex = m.direction;
  const open = duplex === 'right' ? 'left' : 'right';
  const lead = m.leading === 'top' ? 'upper' : 'lower';
  const lag = m.leading === 'top' ? 'lower' : 'upper';
  out.push(`An unopened double strand (two parallel lines joined by rungs) runs in from the ${duplex}; at the fork its two strands part and run out to the ${open} as an upper and a lower arm.`);
  out.push(`Inside the fork a thinner new strand lies along each arm: along the ${lead} arm ONE continuous line${m.arrows ? `, an arrow pointing toward the fork (to the ${duplex})` : ''}; along the ${lag} arm ${plural(m.fragments, 'separate short piece')}${m.arrows ? `, each an arrow pointing away from the fork (to the ${open})` : ''}.${m.arrows ? '' : ' The new strands carry no arrowheads.'}`);
  const ends = FORK_ENDS.filter((e) => m.ends[e] !== 'none');
  for (const e of ends) {
    const s = m.ends[e] === 'blank' ? '?' : END_TRUTH[e];
    printed.push(`end label: ${shown(s)}`);
    out.push(`  ${END_WORDS[e].charAt(0).toUpperCase()}${END_WORDS[e].slice(1)} is labelled ${shown(s)}.`);
  }
  if (ends.length === 0) out.push('  No strand end is labelled.');
  for (const [k, s] of [['continuous', m.strandLabels.leading], ['in pieces', m.strandLabels.lagging]] as const) {
    if (!s) continue;
    printed.push(`strand label: ${shown(s)}`);
    out.push(`  The new strand that is ${k} is labelled ${shown(s)}.`);
  }
  if (m.fragmentLabel) {
    printed.push(`piece label: ${shown(m.fragmentLabel)}`);
    out.push(`  One of the short pieces is marked with a dot and labelled ${shown(m.fragmentLabel)}.`);
  }
  for (const e of m.enzymes) {
    if (e.label !== null) printed.push(`marker label: ${shown(e.label)}`);
    out.push(`  Marker: ${MARKER_WORDS[e.type]}${e.label === null ? ' (not labelled)' : `, labelled ${shown(e.label)}`}.`);
  }
  if (m.primers) {
    if (m.primerKey) printed.push('key entry: "= RNA primer"');
    out.push(`  A short thick block marks the starting end of the continuous new strand (the end far from the fork) and of each short piece (its end nearer the fork)${m.primerKey ? '; a key names the block "RNA primer"' : ''}.`);
  }
  return 'a diagram of a DNA replication fork';
}

const fork = (spec: PracticeFigureSpec): ForkModel => modelOf(spec, forkModel);
/** The one thing that carries a printed label (a "?" counts when it is the only blank of its sort). */
function byLabel<T>(items: Array<{ label: string | null | undefined; it: T }>, want: string, what: string): T {
  const hit = items.filter((x) => x.label === want);
  if (hit.length === 1) return hit[0].it;
  return fail(hit.length === 0 ? `no ${what} of the figure is labelled "${want}"` : `${hit.length} ${what}s of the figure are labelled "${want}" — the question cannot single one out`);
}

const forkCheckers: Record<string, Batch4CheckerDef> = {
  fork_end: {
    kinds: ['replication_fork'], args: `{ end: ${FORK_ENDS.join(' | ')} }`, returns: 'the label "5′" or "3′" of that strand end — for an end shown as "?" or left unlabelled (refused when it is printed, and when no printed end and no arrowhead fixes the direction of the strands)',
    run: (s, a) => {
      const m = fork(s);
      const e = pick(a, 'end', FORK_ENDS);
      if (m.ends[e] === 'value') return fail(`the end ${e} is printed on the figure ("${END_TRUTH[e]}") — hide it (ends: { ${e}: 'blank' }) to ask for it`);
      if (!forkPolaritySettled(m)) return fail('no end is printed and the new strands carry no arrowheads — nothing on the figure fixes which way the strands run');
      return label(END_TRUTH[e]);
    },
  },
  fork_strand: {
    kinds: ['replication_fork'], args: '{ label: the name printed beside a new strand ("X", or "?") }', returns: 'the label "leading" or "lagging": the continuous new strand is the leading strand, the one in pieces the lagging strand (refused when the printed name already says so)',
    run: (s, a) => {
      const m = fork(s);
      const want = argStr(a, 'label');
      const which = byLabel([{ label: m.strandLabels.leading, it: 'leading' }, { label: m.strandLabels.lagging, it: 'lagging' }], want, 'new strand');
      if (/leading|lagging/i.test(want)) return fail(`the strand is named "${want}" on the figure — letter it ("X") or blank it ("?") to ask for it`);
      return label(which);
    },
  },
  fork_enzyme: {
    kinds: ['replication_fork'], args: '{ label: the label printed at a marker ("2", or "?") }', returns: `the label naming the enzyme that acts where that marker sits: ${FORK_ENZYMES.map((e) => `"${ENZYME_NAME[e]}"`).join(', ')} (refused when the marker already prints its name)`,
    run: (s, a) => {
      const m = fork(s);
      const want = argStr(a, 'label');
      const e = byLabel(m.enzymes.map((x) => ({ label: x.label, it: x })), want, 'marker');
      if (want === ENZYME_NAME[e.type]) return fail(`the marker is named "${want}" on the figure — number it or blank it ("?") to ask for it`);
      return label(ENZYME_NAME[e.type]);
    },
  },
  fork_marker: {
    kinds: ['replication_fork'], args: `{ enzyme: ${FORK_ENZYMES.join(' | ')} }`, returns: 'the text printed at the marker where that enzyme acts — its number or letter (refused when the marker is unlabelled, blank, or prints the enzyme\'s name)',
    run: (s, a) => {
      const m = fork(s);
      const type = pick(a, 'enzyme', FORK_ENZYMES);
      const e = m.enzymes.find((x) => x.type === type) ?? fail(`the figure has no marker where ${ENZYME_NAME[type]} acts`);
      if (e.label === null || e.label === '?') return fail(`the marker of ${ENZYME_NAME[type]} carries no label to answer with`);
      if (e.label === ENZYME_NAME[type]) return fail(`the marker is named "${e.label}" on the figure — number the markers to ask which one it is`);
      return text(e.label);
    },
  },
  fork_fragment_count: {
    kinds: ['replication_fork'], args: '{}', returns: 'the number of separate pieces (Okazaki fragments) the discontinuous new strand is drawn in',
    run: (s) => num(fork(s).fragments),
  },
  fork_primer_count: {
    kinds: ['replication_fork'], args: '{ strand?: leading | lagging | both (both) }', returns: 'the number of RNA primers the drawn new strands needed: one for the continuous strand, one for each piece of the other',
    run: (s, a) => {
      const m = fork(s);
      const which = pick(a, 'strand', ['leading', 'lagging', 'both'] as const, 'both');
      return num(which === 'leading' ? 1 : which === 'lagging' ? m.fragments : m.fragments + 1);
    },
  },
};

// ── operon_map ──────────────────────────────────────────────────────────────

const ELEMENT_WORDS = { regulator: 'regulator gene', capSite: 'CAP site', promoter: 'promoter', operator: 'operator', gene: 'structural gene' } as const;
type ElementKey = keyof typeof ELEMENT_WORDS;
/** The boxes of the strip, left to right: what each IS and what it prints. */
function operonBoxes(m: OperonModel): Array<{ key: ElementKey; name: string; label: string }> {
  return [
    { key: 'regulator', name: m.system === 'lac' ? 'lacI' : 'trpR', label: m.labels.regulator },
    ...(m.capSite ? [{ key: 'capSite' as const, name: 'CAP site', label: m.labels.capSite }] : []),
    { key: 'promoter', name: 'promoter', label: m.labels.promoter },
    { key: 'operator', name: 'operator', label: m.labels.operator },
    ...m.genes.map((g, i) => ({ key: 'gene' as const, name: g, label: m.labels.genes[i] })),
  ];
}

function describeOperon(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  const m = modelOf(spec, operonModel);
  const d = operonDrawn(m);
  const boxes = operonBoxes(m);
  if (m.showConditions) {
    printed.push(`conditions line: "${operonConditions(m)}"`);
    out.push(`A line over the figure reads "${operonConditions(m)}".`);
  }
  for (const b of boxes) printed.push(`box label: ${shown(b.label)}`);
  out.push(`A horizontal DNA line carries ${boxes.length} boxes. From the left: one box (${shown(boxes[0].label)}) on its own, a break in the line (two slashes), then ${boxes.length - 1} boxes in an unbroken row: ${boxes.slice(1).map((b) => shown(b.label)).join(', ')}. The ${m.capSite ? 'three' : 'two'} boxes at the start of the row are shaded; the others are white.`);
  // Positions are given by box NUMBER along the row, never by the name of a box that is not printed.
  const rowAt = (key: ElementKey): string => { const k = boxes.findIndex((b) => b.key === key); return `box ${k} of the row (${shown(boxes[k].label)})`; };
  if (m.mutation) {
    printed.push('key entry: "= mutation (function lost)"');
    const k = boxes.findIndex((b) => b.key === m.mutation);
    out.push(`  A cross (✕) is drawn under ${k === 0 ? `the box on its own (${shown(boxes[0].label)})` : rowAt(m.mutation as ElementKey)}; the key reads "✕ = mutation (function lost)".`);
  }
  if (d.repressor) {
    printed.push(`protein tag: ${shown(m.labels.repressor)}`);
    out.push(`  A pill-shaped protein tagged ${shown(m.labels.repressor)} ${m.state.repressorBound ? `sits ON ${rowAt('operator')}` : `floats above ${rowAt('operator')}, not touching the DNA`}${d.effector ? ', with a small filled triangle attached to it' : ''}.`);
    if (m.defaultTags.repressor) printed.push('key entry: "R = repressor"');
  } else out.push(m.showRepressor ? '  No pill-shaped protein is drawn.' : '  (No repressor protein is drawn.)');
  if (d.effector && m.labels.effector !== null) {
    printed.push(m.labels.effector === '?' ? `key entry: ${BLANK}` : `key entry: "= ${m.labels.effector}"`);
    out.push(`  The key gives the triangle as ${m.labels.effector === '?' ? 'a blank "?" box' : `"${m.labels.effector}"`}.`);
  }
  if (m.capSite) {
    if (d.cap) {
      printed.push(`protein tag: ${shown(m.labels.cap)}`);
      if (m.defaultTags.cap) printed.push('key entry: "CAP = activator protein"');
      out.push(`  A round protein tagged ${shown(m.labels.cap)} sits on ${rowAt('capSite')}.`);
    } else out.push(`  Nothing sits on ${rowAt('capSite')}.`);
  }
  if (d.polymerase) {
    printed.push(`protein tag: ${shown(m.labels.polymerase)}`);
    if (m.defaultTags.polymerase) printed.push('key entry: "RNAP = RNA polymerase"');
    out.push(`  An oval protein tagged ${shown(m.labels.polymerase)} sits on ${rowAt('promoter')}.`);
  }
  if (m.transcription === 'value') {
    const lv = m.state.level;
    printed.push(`arrow label: "${LEVEL_TEXT[lv]}"`);
    out.push(lv === 'off'
      ? `  A bent arrow rising where the white boxes of the row begin is cut short by a cross and labelled "${LEVEL_TEXT[lv]}".`
      : `  A bent arrow rises where the white boxes of the row begin and runs to the right over all of them, ${lv === 'low' ? 'drawn thin and dashed, ' : ''}labelled "${LEVEL_TEXT[lv]}".`);
  } else if (m.transcription === 'blank') {
    printed.push(`arrow label: ${BLANK}`);
    out.push('  Where the white boxes of the row begin, a short bent line rises and stops at a blank "?" box: whether an arrow runs on over the genes is left out.');
  } else out.push('  No transcription arrow is drawn.');
  // The operon is named only when the figure itself prints one of its gene names.
  return `a map of ${boxes.some((b) => /^(lac|trp)[A-Z]$/.test(b.label)) ? `the ${m.system} operon` : 'a bacterial operon'}`;
}

/** The model of the spec with some conditions changed by the derivation arguments. */
function operonUnder(spec: PracticeFigureSpec, a: P): { m: OperonModel; changed: boolean } {
  const m = modelOf(spec, operonModel);
  const over: P = {};
  const allowed = m.system === 'lac' ? ['lactose', 'glucose'] : ['tryptophan'];
  for (const k of ['lactose', 'glucose', 'tryptophan']) {
    if (a[k] === undefined) continue;
    if (!allowed.includes(k)) return fail(`derivation argument "${k}" does not apply to the ${m.system} operon`);
    if (typeof a[k] !== 'boolean') return fail(`derivation argument "${k}" must be true or false`);
    over[k] = a[k];
  }
  if (a.mutation !== undefined) {
    if (a.mutation !== 'none' && a.mutation !== 'regulator' && a.mutation !== 'operator' && a.mutation !== 'promoter') return fail('derivation argument "mutation" must be one of none | regulator | operator | promoter');
    over.mutation = a.mutation === 'none' ? null : a.mutation;
  }
  const changed = Object.keys(over).length > 0;
  return { m: changed ? modelOf({ type: spec.type, params: { ...spec.params, ...over } }, operonModel) : m, changed };
}
const CONDITION_ARGS = '{ lactose?: boolean, glucose?: boolean, tryptophan?: boolean, mutation?: none | regulator | operator | promoter } — conditions CHANGED from the figure (the question must state them)';

const operonCheckers: Record<string, Batch4CheckerDef> = {
  operon_transcription: {
    kinds: ['operon_map'], args: CONDITION_ARGS, returns: 'the label for the transcription of the structural genes: lac — "off" (repressor on the operator), "low" (repressor off, glucose present: no CAP) or "high"; trp — "off" or "on". Refused for the state as drawn when the figure prints the arrow itself',
    run: (s, a) => {
      const { m, changed } = operonUnder(s, a);
      if (!changed && m.transcription === 'value') return fail('the transcription arrow is drawn on the figure — set transcription: \'blank\' (or \'none\') to ask for it, or give changed conditions as arguments');
      return label(m.state.level);
    },
  },
  operon_repressor: {
    kinds: ['operon_map'], args: CONDITION_ARGS, returns: 'the label "bound" (the repressor is on the operator), "free" (it is made but not on the operator) or "absent" (no working repressor is made). Refused for the state as drawn when the figure shows the repressor',
    run: (s, a) => {
      const { m, changed } = operonUnder(s, a);
      if (!changed && m.showRepressor && m.state.repressorMade) return fail('the repressor is drawn on the figure — set showRepressor: false to ask where it is, or give changed conditions as arguments');
      return label(!m.state.repressorMade ? 'absent' : m.state.repressorBound ? 'bound' : 'free');
    },
  },
  operon_element: {
    kinds: ['operon_map'], args: '{ label: the text printed in a box of the strip ("2", or "?") }', returns: `the label saying what that box is: ${Object.values(ELEMENT_WORDS).map((w) => `"${w}"`).join(', ')} (refused when the box prints its own name)`,
    run: (s, a) => {
      const m = modelOf(s, operonModel);
      const want = argStr(a, 'label');
      const b = byLabel(operonBoxes(m).map((x) => ({ label: x.label, it: x })), want, 'box');
      if (want === b.name || (b.key === 'promoter' && want === 'P') || (b.key === 'operator' && want === 'O')) return fail(`the box prints its own name ("${want}") — number it or blank it ("?") to ask what it is`);
      return label(ELEMENT_WORDS[b.key]);
    },
  },
  operon_box: {
    kinds: ['operon_map'], args: '{ element: regulator | capSite | promoter | operator }', returns: 'the text printed in the box of that element — its number or letter (refused when the box is blank or prints its own name)',
    run: (s, a) => {
      const m = modelOf(s, operonModel);
      const key = pick(a, 'element', ['regulator', 'capSite', 'promoter', 'operator'] as const);
      const b = operonBoxes(m).find((x) => x.key === key) ?? fail('the figure has no CAP site');
      if (b.label === '?') return fail(`the ${ELEMENT_WORDS[key]} box is blank — there is no label to answer with`);
      if (b.label === b.name || (key === 'promoter' && b.label === 'P') || (key === 'operator' && b.label === 'O')) return fail(`the ${ELEMENT_WORDS[key]} box prints its own name ("${b.label}") — number the boxes to ask which one it is`);
      return text(b.label);
    },
  },
  operon_gene_count: {
    kinds: ['operon_map'], args: '{}', returns: 'the number of structural genes of the operon (the white boxes after the operator — the regulator gene is not one of them)',
    run: (s) => num(modelOf(s, operonModel).genes.length),
  },
};

// ── cell_cycle_wheel ────────────────────────────────────────────────────────

const durText = (m: CycleModel, ph: CyclePhase): string => (ph.showDuration === 'value' ? `${fmt(ph.duration)} ${m.unit}` : ph.showDuration === 'blank' ? '?' : '');

function describeCycle(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  const m = modelOf(spec, cycleModel);
  out.push(`A ring divided into ${m.phases.length} sectors, read clockwise from the top (an arrow inside the ring shows the direction). ${m.scale === 'equal' ? 'The sectors are all the same size and "not to scale" is printed under the ring.' : 'Each sector is as wide as its share of the cycle.'} Each sector has its own hatching (the first is plain).`);
  if (m.scale === 'equal') printed.push('note: "not to scale"');
  m.phases.forEach((ph, i) => {
    const bits: string[] = [];
    if (ph.label !== null) {
      printed.push(`sector label: ${shown(ph.label)}`);
      bits.push(`labelled ${shown(ph.label)}`);
    } else bits.push('not labelled');
    const d = durText(m, ph);
    if (d) {
      printed.push(`duration: ${shown(d)}`);
      bits.push(`its duration is given as ${shown(d)}`);
    }
    out.push(`  Sector ${i + 1}: ${bits.join('; ')}.`);
  });
  if (m.showTotal !== 'none') {
    printed.push('centre label: "one cycle"', `cycle length: ${m.showTotal === 'blank' ? BLANK : `"${fmt(m.total)} ${m.unit}"`}`);
    out.push(`  In the middle: "one cycle" and ${m.showTotal === 'blank' ? 'a blank "?" box' : `"${fmt(m.total)} ${m.unit}"`}.`);
  }
  const place = (c: CycleModel['checkpoints'][number]): string => {
    const parts = c.at.split('/').map((s) => s.trim());
    const idx = (n: string): number => m.phases.findIndex((ph) => ph.name === n) + 1;
    return parts.length === 2 ? `at the boundary between sector ${idx(parts[0])} and sector ${idx(parts[1])}` : `at the middle of sector ${idx(parts[0])}`;
  };
  for (const c of m.checkpoints) {
    if (c.label !== null) printed.push(`checkpoint label: ${shown(c.label)}`);
    out.push(`  A filled triangle on the rim ${place(c)}${c.label === null ? ' (not labelled)' : `, labelled ${shown(c.label)}`}.`);
  }
  if (m.interphase) {
    printed.push(`arc label: ${shown(m.interphase)}`);
    const g1 = m.phases.findIndex((ph) => ph.name === 'G1');
    out.push(`  An arc outside the ring spans sectors ${g1 + 1} to ${g1 + 3}, labelled ${shown(m.interphase)}.`);
  }
  return 'a cell-cycle wheel';
}

const cycle = (spec: PracticeFigureSpec): CycleModel => modelOf(spec, cycleModel);
/** A phase by its true name or by the label its sector prints. */
function phaseOf(m: CycleModel, a: P, k = 'phase'): CyclePhase {
  const want = argStr(a, k);
  const byName = m.phases.find((ph) => ph.name === want);
  if (byName) return byName;
  return byLabel(m.phases.map((ph) => ({ label: ph.label, it: ph })), want, 'sector');
}
/** The cycle length, when the figure (or the argument `total`, which the question must state) gives it. */
function totalOf(m: CycleModel, a: P): number {
  if (a.total !== undefined) {
    const v = argNum(a, 'total');
    if (Math.abs(v - m.total) > 1e-9) return fail(`derivation argument "total" (${fmt(v)}) is not the length of the cycle the figure is drawn for (${fmt(m.total)} ${m.unit})`);
    return v;
  }
  if (m.showTotal === 'value' || m.phases.every((ph) => ph.showDuration === 'value')) return m.total;
  return fail('the length of the cycle is not printed and not every duration is — give it as the derivation argument "total" (the question must then state it)');
}
function durationOf(m: CycleModel, ph: CyclePhase, a: P): number {
  if (ph.showDuration === 'value') return ph.duration;
  const others = m.phases.filter((x) => x !== ph);
  const hidden = others.find((x) => x.showDuration !== 'value');
  if (hidden) return fail(`the duration of ${ph.name} is not printed, and neither is that of ${hidden.name} — the figure does not settle it (a sector's width is not a measurement)`);
  return totalOf(m, a) - others.reduce((s, x) => s + x.duration, 0);
}

const cycleCheckers: Record<string, Batch4CheckerDef> = {
  cycle_duration: {
    kinds: ['cell_cycle_wheel'], args: '{ phase: its name or the label its sector prints, total?: number }', returns: 'the duration of that phase: printed; or, when hidden, the cycle length (printed, or the argument "total") minus the other printed durations',
    run: (s, a) => { const m = cycle(s); return measured(durationOf(m, phaseOf(m, a), a)); },
  },
  cycle_total: {
    kinds: ['cell_cycle_wheel'], args: '{}', returns: 'the length of one cycle: the sum of the printed durations (refused when one is hidden — and when the length itself is printed in the middle)',
    run: (s) => {
      const m = cycle(s);
      if (m.showTotal === 'value') return fail('the length of the cycle is printed in the middle of the wheel — set total: \'blank\' to ask for it');
      const hidden = m.phases.find((ph) => ph.showDuration !== 'value');
      if (hidden) return fail(`the duration of ${hidden.name} is not printed — the cycle length cannot be summed`);
      return measured(m.total);
    },
  },
  cycle_fraction: {
    kinds: ['cell_cycle_wheel'], args: '{ phase, as?: fraction | percent (fraction), total?: number }', returns: 'the share of the cycle spent in that phase — duration ÷ cycle length, as a decimal fraction or a percentage',
    run: (s, a) => {
      const m = cycle(s);
      const f = durationOf(m, phaseOf(m, a), a) / totalOf(m, a);
      return measured(pick(a, 'as', ['fraction', 'percent'] as const, 'fraction') === 'percent' ? f * 100 : f);
    },
  },
  cycle_interphase: {
    kinds: ['cell_cycle_wheel'], args: '{ total?: number }', returns: 'the length of interphase: G1 + S + G2 (the figure must have those three phases)',
    run: (s, a) => {
      const m = cycle(s);
      const three = ['G1', 'S', 'G2'].map((n) => m.phases.find((ph) => ph.name === n) ?? fail(`the wheel has no ${n} phase`));
      return measured(three.reduce((t, ph) => t + durationOf(m, ph, a), 0));
    },
  },
  cycle_cells_in_phase: {
    kinds: ['cell_cycle_wheel'], args: '{ phase, cells: number, total?: number }', returns: 'the expected number of cells in that phase when `cells` cells divide out of step with one another: cells × (duration ÷ cycle length)',
    run: (s, a) => {
      const m = cycle(s);
      const cells = argNum(a, 'cells');
      if (!(cells > 0)) return fail('derivation argument "cells" must be greater than 0');
      return measured((cells * durationOf(m, phaseOf(m, a), a)) / totalOf(m, a));
    },
  },
  cycle_phase: {
    kinds: ['cell_cycle_wheel'], args: '{ label: the label a sector prints ("X", or "?") }', returns: 'the label naming the phase of that sector, from its place in the clockwise order — settled only when at least one OTHER sector prints its own name (refused when the sector itself does)',
    run: (s, a) => {
      const m = cycle(s);
      const want = argStr(a, 'label');
      const ph = byLabel(m.phases.map((x) => ({ label: x.label, it: x })), want, 'sector');
      if (ph.label === ph.name) return fail(`the sector prints its own name ("${ph.name}") — letter it or blank it ("?") to ask for it`);
      if (!m.phases.some((x) => x !== ph && x.label === x.name)) return fail('no other sector prints its name — nothing on the figure fixes where the cycle starts');
      return label(ph.name);
    },
  },
  cycle_checkpoint: {
    kinds: ['cell_cycle_wheel'], args: '{ label: the label printed at a checkpoint triangle ("1", or "?") }', returns: 'the label saying where that checkpoint stands: "G1/S", "G2/M" (a boundary) or a phase name ("M") — settled only when the sectors on both sides print their names',
    run: (s, a) => {
      const m = cycle(s);
      const want = argStr(a, 'label');
      const c = byLabel(m.checkpoints.map((x) => ({ label: x.label, it: x })), want, 'checkpoint');
      if (want.includes(c.at)) return fail(`the checkpoint is named "${want}" on the figure — number it or blank it ("?") to ask for it`);
      for (const n of c.at.split('/').map((x) => x.trim())) {
        const ph = m.phases.find((x) => x.name === n) as CyclePhase;
        if (ph.label !== ph.name) return fail(`the sector of ${n} does not print its name — the figure does not say which boundary the triangle stands at`);
      }
      return label(c.at);
    },
  },
  cycle_dna_content: {
    kinds: ['cell_cycle_wheel'], args: '{ phase: G1 | G2 | M (name or sector label), g1?: number (2) }', returns: 'the DNA content of a cell in that phase, in the units in which a G1 cell has `g1` (2C by default): G1 = g1; G2 and M (before the cell divides) = 2 × g1. Refused for S, where it is changing',
    run: (s, a) => {
      const m = cycle(s);
      const ph = phaseOf(m, a);
      const g1 = a.g1 === undefined ? 2 : argNum(a, 'g1');
      if (!(g1 > 0)) return fail('derivation argument "g1" must be greater than 0');
      if (ph.name === 'G1' || ph.name === 'G0') return num(g1);
      if (ph.name === 'G2' || ph.name === 'M') return num(2 * g1);
      return fail(ph.name === 'S' ? 'during S the DNA content is rising from the G1 value to twice it — it has no single value' : `the DNA content of a phase named "${ph.name}" is not a textbook fact this checker knows`);
    },
  },
};

// ── the part ────────────────────────────────────────────────────────────────

function describe(spec: PracticeFigureSpec, printed: string[], out: string[]): string {
  if (spec.type === 'replication_fork') return describeFork(spec, printed, out);
  if (spec.type === 'operon_map') return describeOperon(spec, printed, out);
  if (spec.type === 'cell_cycle_wheel') return describeCycle(spec, printed, out);
  return '';
}

export const PART: Batch4Part = {
  kinds: ['replication_fork', 'operon_map', 'cell_cycle_wheel'],
  describe,
  checkers: { ...forkCheckers, ...operonCheckers, ...cycleCheckers },
};
