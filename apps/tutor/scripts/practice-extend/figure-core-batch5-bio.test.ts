/**
 * Tests for scripts/practice-extend/figure-core-batch5-bio.ts
 * (replication_fork, operon_map, cell_cycle_wheel), reached the way the job
 * reaches it — through figure-core.ts (`describeFigure`, `describeForAlt`,
 * `runChecker`, `compareDerived`, `examineFigureItem`, `checkerCatalogue`,
 * `axesOf`).
 *
 * Per checker: at least one right key accepted and one wrong key rejected;
 * the biology against textbook cases with known answers (lac: off without
 * lactose, high with lactose and no glucose, low with both; trp: off with
 * tryptophan; lacI⁻ and Oᶜ constitutive; the leading strand's template runs
 * 3′ → 5′ toward the fork; one primer per Okazaki fragment; a 24-hour cycle
 * with a 1-hour M has 1/24 of its cells in mitosis; G2 = twice the G1 DNA).
 * Per kind: the transcription says what is printed, keeps a blank blank, and
 * never names what the figure does not name.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch5-bio.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b5-bio';
import { BATCH2_CHECKERS, BATCH3_CHECKERS, BATCH4_CHECKERS, BATCH5_CHECKERS, CHECKERS, FigureRuleError, axesOf, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART } from './figure-core-batch5-bio';

let passed = 0;
function test(name: string, fn: () => void): void {
  try {
    fn();
    passed++;
  } catch (e) {
    console.error(`FAIL ${name}\n  ${(e as Error).message}`);
    process.exitCode = 1;
  }
}

type Args = Record<string, unknown>;
const used = new Set<string>();
const run = (spec: PracticeFigureSpec, checker: string, args: Args = {}): Derived => {
  used.add(checker);
  return runChecker(spec, { checker, args });
};
const refused = (fn: () => unknown, re: RegExp): void => { assert.throws(fn, (e: unknown) => e instanceof FigureRuleError && re.test((e as Error).message), String(re)); };
function item(spec: PracticeFigureSpec, over: Partial<FigureItem>): FigureItem {
  return {
    objectiveLoId: 'gen-x.lo-1', responseFormat: 'free', problemText: 'Use the figure shown. What does it give?', answer: '0', choices: [], hints: ['Read the figure.'],
    solutionText: 'Work it out from the figure.', difficulty: 2, covers: 'reading the figure', taskType: 'read a value', distractorRationales: [],
    figureSpec: spec, alt: 'A figure.', derivation: { checker: 'none', args: {} }, ...over,
  };
}
/** Right key accepted, wrong key rejected — for one checker on one spec. */
function rw(spec: PracticeFigureSpec, checker: string, args: Args, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  const fmt = /^[−-]?[\d.]+%?$/.test(right) ? 'numeric' : 'free';
  assert.equal(compareDerived(item(spec, { answer: right, responseFormat: fmt }), d).match, true, `${checker} ${JSON.stringify(args)}: "${right}" should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { answer: wrong, responseFormat: fmt }), d).match, false, `${checker} ${JSON.stringify(args)}: "${wrong}" should not match ${JSON.stringify(d)}`);
}
const F = (params: Args = {}): PracticeFigureSpec => ({ type: 'replication_fork', params });
const O = (params: Args): PracticeFigureSpec => ({ type: 'operon_map', params });
const C = (params: Args = {}): PracticeFigureSpec => ({ type: 'cell_cycle_wheel', params });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;

test('the part is registered through figure-core.ts and shadows nothing', () => {
  assert.deepEqual([...PART.kinds], ['replication_fork', 'operon_map', 'cell_cycle_wheel']);
  for (const name of Object.keys(PART.checkers)) {
    assert.ok(!(name in CHECKERS) && !(name in BATCH2_CHECKERS) && !(name in BATCH3_CHECKERS) && !(name in BATCH4_CHECKERS), `${name} must not shadow an earlier checker`);
    assert.equal(BATCH5_CHECKERS[name], PART.checkers[name], name);
  }
  for (const k of PART.kinds) {
    const cat = checkerCatalogue([k as never]);
    for (const [name, d] of Object.entries(PART.checkers)) if (d.kinds.includes(k)) assert.ok(cat.includes(`- ${name} ${d.args} → ${d.returns}`), name);
  }
  for (const f of FIXTURES) assert.deepEqual(axesOf(f.spec), {}, f.id);
  refused(() => run(F(), 'operon_transcription'), /is for operon_map, not for replication_fork/);
  refused(() => describeFigure(F({ fragments: 7 })), /fragments must be a whole number from 1 to 4/);
  refused(() => describeFigure(O({ system: 'ara' })), /system must be "lac" or "trp"/);
});

test('every fixture has a transcription and an alt draft; a blank is transcribed as a blank; an alt names no number outside a printed label', () => {
  for (const f of FIXTURES) {
    const d = describeFigure(f.spec);
    assert.ok(/^The figure is \S/.test(d.text) && d.text.includes('TEXT PRINTED ON THE FIGURE:') && d.readable.length > 0, f.id);
    assert.ok(!/undefined|NaN|\[object/.test(d.text), `${f.id}: ${d.text}`);
    if (/blank/.test(f.id)) assert.ok(/blank/.test(d.text), `${f.id}: the blank is transcribed as a blank`);
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600 && !/\d/.test(alt.replace(/"[^"]*"/g, '')), `${f.id}: ${alt}`);
    if (/blank/.test(f.id)) assert.ok(/left blank/.test(alt), `${f.id}: ${alt}`);
  }
});

// ── replication_fork ────────────────────────────────────────────────────────

test('fork: the transcription says continuous / in pieces and where each marker sits — it names no strand and no enzyme the figure does not name', () => {
  const t = textOf(fx('fork-dense-numbered-enzymes'));
  assert.ok(t.includes('The figure is a diagram of a DNA replication fork.'));
  assert.ok(t.includes('along the upper arm ONE continuous line, an arrow pointing toward the fork (to the right)') && t.includes('along the lower arm 3 separate short pieces, each an arrow pointing away from the fork (to the left)'));
  assert.ok(t.includes('Marker: a wedge in the mouth of the fork, where the two parental strands part, labelled "1".') && t.includes('a diamond over the gap between the two pieces farthest from the fork, labelled "4"'));
  assert.ok(!/helicase|primase|polymerase|ligase|Okazaki/.test(t), 'no enzyme is named by a numbered figure');
  assert.ok(t.includes('The new strand that is continuous is labelled "leading strand".') && t.includes('a key names the block "RNA primer"'));
  const plain = textOf(fx('fork-simple-lettered-strands'));
  assert.ok(!/leading|lagging/.test(plain) && plain.includes('The new strand that is in pieces is labelled "Y".'));
  const mirrored = textOf(fx('fork-blank-template-end'));
  assert.ok(mirrored.includes('runs in from the left') && mirrored.includes('along the lower arm ONE continuous line') && mirrored.includes('to the left)'));
  assert.ok(mirrored.includes('The open end of the parental strand that the new strand in pieces lies along is labelled (blank — a "?" box).') && !/is labelled "5′"\.\n[^\n]*in pieces lies along is labelled "5′"/.test(mirrored));
  assert.ok(textOf(fx('fork-blank-direction-enzyme')).includes('The new strands carry no arrowheads.'));
  assert.ok(textOf(F({ templateEnds: 'none' })).includes('No strand end is labelled.'));
});

test('fork: the alt names printed labels only — never the end under a "?", never an enzyme behind a number', () => {
  const alt = describeForAlt(fx('fork-blank-template-end'));
  assert.ok(/end labels "3′", "5′"/.test(alt) && /One place is left blank/.test(alt), alt);
  const dense = describeForAlt(fx('fork-dense-numbered-enzymes'));
  assert.ok(/marker labels "1", "2", "3", "4"/.test(dense) && !/helicase|ligase/.test(dense), dense);
  assert.ok(/marker label /.test(describeForAlt(fx('fork-blank-direction-enzyme'))) === false);
});

test('fork_end: template of the leading strand runs 3′ (open end) → 5′; of the lagging strand 5′ → 3′; new strands start 5′ and grow at 3′', () => {
  const hidden = F({ templateEnds: 'blank' });
  rw(hidden, 'fork_end', { end: 'template_leading_open' }, '3′', '5′');
  rw(hidden, 'fork_end', { end: 'template_leading_parental' }, '5′', '3′');
  rw(hidden, 'fork_end', { end: 'template_lagging_open' }, "5'", "3'");
  rw(hidden, 'fork_end', { end: 'template_lagging_parental' }, '3′', '5′');
  rw(F(), 'fork_end', { end: 'leading_tip' }, '3′ end', '5′ end');
  rw(F(), 'fork_end', { end: 'leading_start' }, '5′', '3′');
  rw(F(), 'fork_end', { end: 'lagging_start' }, '5′', '3′');
  rw(F(), 'fork_end', { end: 'lagging_tip' }, '3′', '5′');
  rw(fx('fork-blank-template-end'), 'fork_end', { end: 'template_lagging_open' }, '5′', '3′');
  // Mirroring the picture changes no polarity.
  rw(F({ leading: 'bottom', forkDirection: 'left', templateEnds: 'blank' }), 'fork_end', { end: 'template_leading_open' }, '3′', '5′');
  refused(() => run(F(), 'fork_end', { end: 'template_leading_open' }), /is printed on the figure/);
  refused(() => run(F({ templateEnds: 'blank', arrows: false }), 'fork_end', { end: 'leading_tip' }), /nothing on the figure fixes which way the strands run/);
  refused(() => run(F(), 'fork_end', { end: 'top_left' }), /must be one of template_leading_open/);
});

test('fork_strand: the continuous strand is the leading strand, the one in pieces the lagging strand', () => {
  const s = fx('fork-simple-lettered-strands');
  rw(s, 'fork_strand', { label: 'X' }, 'leading', 'lagging');
  rw(s, 'fork_strand', { label: 'Y' }, 'the lagging strand', 'the leading strand');
  rw(F({ strandLabels: { lagging: '?' } }), 'fork_strand', { label: '?' }, 'lagging strand', 'leading strand');
  rw(F({ leading: 'bottom', strandLabels: { leading: 'P', lagging: 'Q' } }), 'fork_strand', { label: 'P' }, 'leading', 'lagging');
  refused(() => run(s, 'fork_strand', { label: 'Z' }), /no new strand of the figure is labelled "Z"/);
  refused(() => run(F({ strandLabels: { leading: '?', lagging: '?' } }), 'fork_strand', { label: '?' }), /2 new strands of the figure are labelled "\?"/);
  refused(() => run(fx('fork-dense-numbered-enzymes'), 'fork_strand', { label: 'leading strand' }), /is named "leading strand" on the figure/);
});

test('fork_enzyme / fork_marker: helicase at the fork, polymerase at the growing end, primase where a fragment starts, ligase at the gap', () => {
  const s = fx('fork-dense-numbered-enzymes');
  rw(s, 'fork_enzyme', { label: '1' }, 'helicase', 'DNA ligase');
  rw(s, 'fork_enzyme', { label: '2' }, 'DNA polymerase', 'primase');
  rw(s, 'fork_enzyme', { label: '3' }, 'primase', 'helicase');
  rw(s, 'fork_enzyme', { label: '4' }, 'DNA ligase', 'DNA polymerase');
  rw(fx('fork-blank-direction-enzyme'), 'fork_enzyme', { label: '?' }, 'Helicase', 'Primase');
  rw(s, 'fork_marker', { enzyme: 'ligase' }, '4', '1');
  rw(s, 'fork_marker', { enzyme: 'helicase' }, '1', '3');
  refused(() => run(fx('fork-named-enzymes-fragment'), 'fork_enzyme', { label: 'helicase' }), /is named "helicase" on the figure/);
  refused(() => run(fx('fork-named-enzymes-fragment'), 'fork_marker', { enzyme: 'primase' }), /is named "primase" on the figure/);
  refused(() => run(fx('fork-blank-direction-enzyme'), 'fork_marker', { enzyme: 'helicase' }), /carries no label to answer with/);
  refused(() => run(fx('fork-simple-lettered-strands'), 'fork_marker', { enzyme: 'ligase' }), /no marker where DNA ligase acts/);
  refused(() => run(s, 'fork_enzyme', { label: '9' }), /no marker of the figure is labelled "9"/);
});

test('fork_fragment_count / fork_primer_count: one primer for the leading strand, one per Okazaki fragment', () => {
  rw(F(), 'fork_fragment_count', {}, '3', '4');
  rw(F({ fragments: 2 }), 'fork_fragment_count', {}, '2', '3');
  rw(F(), 'fork_primer_count', {}, '4', '3');
  rw(F(), 'fork_primer_count', { strand: 'lagging' }, '3', '1');
  rw(F({ fragments: 4 }), 'fork_primer_count', { strand: 'leading' }, '1', '4');
  rw(F({ fragments: 4 }), 'fork_primer_count', { strand: 'both' }, '5', '4');
  refused(() => run(F(), 'fork_primer_count', { strand: 'template' }), /must be one of leading \| lagging \| both/);
});

// ── operon_map ──────────────────────────────────────────────────────────────

test('operon: the transcription gives the strip box by box and each protein by shape and place — the state is what is drawn', () => {
  const t = textOf(fx('operon-dense-lac-induced-cap'));
  assert.ok(t.includes('The figure is a map of the lac operon.') && t.includes('A line over the figure reads "lactose present, glucose absent".'));
  assert.ok(t.includes('then 6 boxes in an unbroken row: "CAP site", "P", "O", "lacZ", "lacY", "lacA"'));
  assert.ok(t.includes('A pill-shaped protein tagged "R" floats above box 3 of the row ("O"), not touching the DNA, with a small filled triangle attached to it.'));
  assert.ok(t.includes('A round protein tagged "CAP" sits on box 1 of the row ("CAP site").') && t.includes('An oval protein tagged "RNAP" sits on box 2 of the row ("P").'));
  assert.ok(t.includes('runs to the right over all of them, labelled "transcription"') && t.includes('The key gives the triangle as "allolactose".'));
  const off = textOf(fx('operon-simple-lac-repressed'));
  assert.ok(off.includes('sits ON box 2 of the row ("O")') && off.includes('cut short by a cross and labelled "no transcription"') && !/oval protein/.test(off));
  const low = textOf(fx('operon-lac-low-glucose-present'));
  assert.ok(low.includes('Nothing sits on box 1 of the row ("CAP site").') && low.includes('drawn thin and dashed, labelled "low transcription"'));
  const blank = textOf(fx('operon-blank-trp-transcription'));
  assert.ok(blank.includes('stops at a blank "?" box') && !/"transcription"|"no transcription"/.test(blank), 'the hidden state is not transcribed');
  const numbered = textOf(fx('operon-blank-operator-numbered'));
  assert.ok(numbered.includes('tagged "X" sits ON box 2 of the row ((blank — a "?" box))') && !/operator|promoter|repressor/.test(numbered), numbered);
  const mutant = textOf(fx('operon-trp-operator-mutant'));
  assert.ok(mutant.includes('A cross (✕) is drawn under box 2 of the row ("O")') && mutant.includes('floats above box 2 of the row'));
});

test('operon: the alt never states a hidden state or names a blank box', () => {
  const alt = describeForAlt(fx('operon-blank-trp-transcription'));
  assert.ok(/left blank/.test(alt) && !/no transcription|"transcription"/.test(alt), alt);
  const numbered = describeForAlt(fx('operon-blank-operator-numbered'));
  assert.ok(/A map of the lac operon/.test(numbered) && !/operator|"O"/.test(numbered), numbered);
  assert.ok(/A map of a bacterial operon/.test(describeForAlt(O({ system: 'lac', labels: { regulator: '1', promoter: '2', operator: '3', genes: ['4', '5', '6'] }, transcription: 'none' }))));
});

test('operon_transcription: the lac operon — off without lactose, high with lactose alone, low with lactose and glucose (the textbook table)', () => {
  const lac = (lactose: boolean, glucose: boolean, more: Args = {}): PracticeFigureSpec => O({ system: 'lac', lactose, glucose, transcription: 'blank', ...more });
  rw(lac(false, false), 'operon_transcription', {}, 'off', 'high');
  rw(lac(false, true), 'operon_transcription', {}, 'Transcription is off.', 'Transcription is low.');
  rw(lac(true, false), 'operon_transcription', {}, 'high', 'low');
  rw(lac(true, true), 'operon_transcription', {}, 'low', 'high');
  // Mutants: lacI⁻ and Oᶜ are constitutive (no lactose needed); a dead promoter is never transcribed.
  rw(lac(false, false, { mutation: 'regulator' }), 'operon_transcription', {}, 'high', 'off');
  rw(lac(false, false, { mutation: 'operator' }), 'operon_transcription', {}, 'high', 'off');
  rw(lac(true, false, { mutation: 'promoter' }), 'operon_transcription', {}, 'off', 'high');
  rw(lac(false, true, { mutation: 'operator' }), 'operon_transcription', {}, 'low', 'off');
  // The state under CHANGED conditions, from a figure that draws another state.
  rw(fx('operon-simple-lac-repressed'), 'operon_transcription', { lactose: true }, 'high', 'off');
  rw(fx('operon-dense-lac-induced-cap'), 'operon_transcription', { glucose: true }, 'low', 'high');
  rw(fx('operon-dense-lac-induced-cap'), 'operon_transcription', { lactose: false }, 'off', 'low');
  rw(fx('operon-simple-lac-repressed'), 'operon_transcription', { mutation: 'regulator' }, 'high', 'off');
  refused(() => run(fx('operon-simple-lac-repressed'), 'operon_transcription'), /the transcription arrow is drawn on the figure/);
  refused(() => run(fx('operon-simple-lac-repressed'), 'operon_transcription', { tryptophan: true }), /"tryptophan" does not apply to the lac operon/);
  refused(() => run(fx('operon-simple-lac-repressed'), 'operon_transcription', { lactose: 'yes' }), /"lactose" must be true or false/);
});

test('operon_transcription: the trp operon — on without tryptophan, off with it (a repressible operon); trpR⁻ and Oᶜ stay on', () => {
  const trp = (tryptophan: boolean, more: Args = {}): PracticeFigureSpec => O({ system: 'trp', tryptophan, transcription: 'blank', ...more });
  rw(trp(false), 'operon_transcription', {}, 'on', 'off');
  rw(trp(true), 'operon_transcription', {}, 'off', 'on');
  rw(fx('operon-blank-trp-transcription'), 'operon_transcription', {}, 'The genes are off', 'The genes are on');
  rw(trp(true, { mutation: 'regulator' }), 'operon_transcription', {}, 'on', 'off');
  rw(trp(true, { mutation: 'operator' }), 'operon_transcription', {}, 'on', 'off');
  rw(fx('operon-trp-operator-mutant'), 'operon_transcription', { mutation: 'none' }, 'off', 'on');
  rw(fx('operon-blank-trp-transcription'), 'operon_transcription', { tryptophan: false }, 'on', 'off');
  refused(() => run(trp(true), 'operon_transcription', { glucose: true }), /"glucose" does not apply to the trp operon/);
});

test('operon_repressor: bound, free or absent — asked only when the figure does not show it', () => {
  const hidden = (p: Args): PracticeFigureSpec => O({ showRepressor: false, showConditions: true, transcription: 'none', ...p });
  rw(hidden({ system: 'lac' }), 'operon_repressor', {}, 'bound', 'free');
  rw(hidden({ system: 'lac', lactose: true }), 'operon_repressor', {}, 'free', 'bound');
  rw(hidden({ system: 'trp' }), 'operon_repressor', {}, 'free', 'bound');
  rw(hidden({ system: 'trp', tryptophan: true }), 'operon_repressor', {}, 'bound to the operator', 'free in the cell');
  rw(hidden({ system: 'lac', mutation: 'regulator' }), 'operon_repressor', {}, 'absent', 'bound');
  rw(fx('operon-simple-lac-repressed'), 'operon_repressor', { lactose: true }, 'free', 'bound');
  refused(() => run(fx('operon-simple-lac-repressed'), 'operon_repressor'), /the repressor is drawn on the figure/);
});

test('operon_element / operon_box / operon_gene_count: what a numbered box is, which box an element is, how many structural genes', () => {
  const s = fx('operon-blank-operator-numbered');
  rw(s, 'operon_element', { label: '?' }, 'operator', 'promoter');
  rw(s, 'operon_element', { label: '1' }, 'the promoter', 'the operator');
  rw(s, 'operon_element', { label: '3' }, 'structural gene', 'regulator gene');
  rw(O({ system: 'lac', capSite: true, labels: { regulator: 'A', capSite: 'B', promoter: 'C', operator: 'D' } }), 'operon_element', { label: 'B' }, 'CAP site', 'operator');
  rw(O({ system: 'lac', labels: { regulator: 'A' } }), 'operon_element', { label: 'A' }, 'regulator gene', 'structural gene');
  rw(s, 'operon_box', { element: 'promoter' }, '1', '2');
  refused(() => run(s, 'operon_box', { element: 'operator' }), /the operator box is blank/);
  refused(() => run(s, 'operon_box', { element: 'capSite' }), /no CAP site/);
  refused(() => run(fx('operon-simple-lac-repressed'), 'operon_box', { element: 'operator' }), /prints its own name \("O"\)/);
  refused(() => run(fx('operon-simple-lac-repressed'), 'operon_element', { label: 'lacZ' }), /prints its own name/);
  rw(fx('operon-simple-lac-repressed'), 'operon_gene_count', {}, '3', '4');
  rw(fx('operon-blank-trp-transcription'), 'operon_gene_count', {}, '5', '6');
});

// ── cell_cycle_wheel ────────────────────────────────────────────────────────

test('cycle: the transcription lists the sectors clockwise with what each prints; a hidden duration or name is a blank', () => {
  const t = textOf(fx('cycle-simple-four-phases'));
  assert.ok(t.includes('The figure is a cell-cycle wheel.') && t.includes('A ring divided into 4 sectors, read clockwise from the top') && t.includes('Each sector is as wide as its share of the cycle.'));
  assert.ok(t.includes('Sector 1: labelled "G1"; its duration is given as "11 h".') && t.includes('Sector 4: labelled "M"; its duration is given as "1 h".'));
  const blank = textOf(fx('cycle-blank-duration-s'));
  assert.ok(blank.includes('Sector 2: labelled "S"; its duration is given as (blank — a "?" box).') && blank.includes('In the middle: "one cycle" and "24 h".') && !/"8 h"/.test(blank));
  const eq = textOf(fx('cycle-blank-name-equal-not-to-scale'));
  assert.ok(eq.includes('The sectors are all the same size and "not to scale" is printed under the ring.') && eq.includes('Sector 2: labelled (blank — a "?" box).') && eq.includes('A filled triangle on the rim at the boundary between sector 1 and sector 2, labelled "1".'));
  assert.ok(!/"S"/.test(eq), 'the name under the blank is not given');
  const dense = textOf(fx('cycle-dense-checkpoints-interphase'));
  assert.ok(dense.includes('A filled triangle on the rim at the middle of sector 4, labelled "M checkpoint".') && dense.includes('An arc outside the ring spans sectors 1 to 3, labelled "interphase".'));
  assert.ok(textOf(fx('cycle-blank-total-short-m')).includes('In the middle: "one cycle" and a blank "?" box.'));
});

test('cycle: the alt prints no hidden duration, name or cycle length', () => {
  const alt = describeForAlt(fx('cycle-blank-duration-s'));
  assert.ok(/durations "10 h", "4 h", "2 h"/.test(alt) && !/"8 h"/.test(alt) && /left blank/.test(alt), alt);
  assert.ok(!/"24 h"|"16 h"/.test(describeForAlt(fx('cycle-blank-total-short-m'))));
  assert.ok(!/"S"/.test(describeForAlt(fx('cycle-blank-name-equal-not-to-scale'))));
});

test('cycle_duration / cycle_total / cycle_interphase: printed, or the cycle length minus the rest', () => {
  rw(fx('cycle-simple-four-phases'), 'cycle_duration', { phase: 'S' }, '8', '11');
  rw(fx('cycle-blank-duration-s'), 'cycle_duration', { phase: 'S' }, '8', '6');
  rw(C({ phases: [{ name: 'G1', duration: 10 }, { name: 'S', duration: 8, label: 'X', showDuration: 'blank' }, { name: 'G2', duration: 4 }, { name: 'M', duration: 2 }] }), 'cycle_duration', { phase: 'X', total: 24 }, '8', '10');
  rw(fx('cycle-simple-four-phases'), 'cycle_total', {}, '24', '23');
  rw(fx('cycle-blank-total-short-m'), 'cycle_total', {}, '16', '15');
  rw(fx('cycle-simple-four-phases'), 'cycle_interphase', {}, '23', '24');
  rw(fx('cycle-blank-duration-s'), 'cycle_interphase', {}, '22', '14');
  const twoHidden = C({ durations: 'blank', total: 'value' });
  refused(() => run(twoHidden, 'cycle_duration', { phase: 'S' }), /is not printed, and neither is that of G1/);
  refused(() => run(C({ phases: [{ name: 'G1', duration: 10 }, { name: 'S', duration: 8, showDuration: 'blank' }, { name: 'G2', duration: 4 }, { name: 'M', duration: 2 }] }), 'cycle_duration', { phase: 'S' }), /give it as the derivation argument "total"/);
  refused(() => run(fx('cycle-blank-duration-s'), 'cycle_duration', { phase: 'S', total: 30 }), /is not the length of the cycle the figure is drawn for/);
  refused(() => run(fx('cycle-blank-duration-s'), 'cycle_total'), /is printed in the middle of the wheel/);
  refused(() => run(fx('cycle-blank-name-equal-not-to-scale'), 'cycle_total'), /the duration of G1 is not printed/);
  refused(() => run(fx('cycle-simple-four-phases'), 'cycle_duration', { phase: 'G0' }), /no sector of the figure is labelled "G0"/);
  refused(() => run(C({ phases: [{ name: 'P', duration: 1 }, { name: 'Q', duration: 2 }, { name: 'R', duration: 3 }] }), 'cycle_interphase'), /the wheel has no G1 phase/);
});

test('cycle_fraction / cycle_cells_in_phase: a 24-hour cycle with a 1-hour M — 1/24 of the cycle, about 4 % of unsynchronised cells in mitosis', () => {
  const s = fx('cycle-simple-four-phases');
  rw(s, 'cycle_fraction', { phase: 'S' }, '0.333', '0.25');
  rw(s, 'cycle_fraction', { phase: 'M', as: 'percent' }, '4.2', '1');
  rw(s, 'cycle_fraction', { phase: 'G1', as: 'percent' }, '45.8', '11');
  rw(fx('cycle-blank-duration-s'), 'cycle_fraction', { phase: 'G2' }, '0.167', '0.4');
  // Mitotic index: of 1200 cells, 1200 × 1/24 = 50 are in M; 400 are in S (8/24).
  rw(s, 'cycle_cells_in_phase', { phase: 'M', cells: 1200 }, '50', '100');
  rw(s, 'cycle_cells_in_phase', { phase: 'S', cells: 1200 }, '400', '300');
  rw(fx('cycle-dense-checkpoints-interphase'), 'cycle_cells_in_phase', { phase: 'M', cells: 400 }, '50', '25');
  refused(() => run(s, 'cycle_cells_in_phase', { phase: 'M', cells: 0 }), /"cells" must be greater than 0/);
  refused(() => run(fx('cycle-blank-name-equal-not-to-scale'), 'cycle_fraction', { phase: 'M' }), /is not printed/);
});

test('cycle_phase / cycle_checkpoint: a lettered or blank sector is named from the clockwise order; a numbered checkpoint from the named sectors beside it', () => {
  const s = fx('cycle-blank-name-equal-not-to-scale');
  rw(s, 'cycle_phase', { label: '?' }, 'S', 'G2');
  rw(s, 'cycle_phase', { label: 'X' }, 'G2 phase', 'S phase');
  refused(() => run(s, 'cycle_phase', { label: 'M' }), /prints its own name/);
  refused(() => run(C({ phases: [{ name: 'G1', duration: 1, label: 'W' }, { name: 'S', duration: 1, label: 'X' }, { name: 'G2', duration: 1, label: 'Y' }, { name: 'M', duration: 1, label: 'Z' }] }), 'cycle_phase', { label: 'X' }), /no other sector prints its name/);
  const cp = C({ durations: 'none', checkpoints: [{ at: 'G1/S', label: '1' }, { at: 'G2/M', label: '2' }, { at: 'M', label: '3' }] });
  rw(cp, 'cycle_checkpoint', { label: '1' }, 'G1/S', 'G2/M');
  rw(cp, 'cycle_checkpoint', { label: '2' }, 'the G2/M checkpoint', 'the G1/S checkpoint');
  rw(cp, 'cycle_checkpoint', { label: '3' }, 'M', 'S');
  refused(() => run(s, 'cycle_checkpoint', { label: '1' }), /the sector of S does not print its name/);
  refused(() => run(fx('cycle-dense-checkpoints-interphase'), 'cycle_checkpoint', { label: 'G1/S checkpoint' }), /is named "G1\/S checkpoint" on the figure/);
});

test('cycle_dna_content: G1 = 2C, G2 and M = 4C; S has no single value', () => {
  const s = fx('cycle-simple-four-phases');
  rw(s, 'cycle_dna_content', { phase: 'G1' }, '2', '4');
  rw(s, 'cycle_dna_content', { phase: 'G2' }, '4', '2');
  rw(s, 'cycle_dna_content', { phase: 'M' }, '4', '8');
  rw(s, 'cycle_dna_content', { phase: 'G2', g1: 6.4 }, '12.8', '6.4');
  rw(fx('cycle-blank-name-equal-not-to-scale'), 'cycle_dna_content', { phase: 'X' }, '4', '2');
  refused(() => run(s, 'cycle_dna_content', { phase: 'S' }), /it has no single value/);
  refused(() => run(s, 'cycle_dna_content', { phase: 'G1', g1: -1 }), /"g1" must be greater than 0/);
});

// ── the item gate ───────────────────────────────────────────────────────────

test('an item on each kind is examined like any other: the key is recomputed from the spec', () => {
  const mc = item(fx('fork-dense-numbered-enzymes'), {
    responseFormat: 'mcq', problemText: 'In the replication fork shown, which enzyme acts at the marker numbered 4?', choices: ['helicase', 'primase', 'DNA polymerase', 'DNA ligase'], answer: 'D',
    alt: 'A replication fork with four numbered enzyme markers.', derivation: { checker: 'fork_enzyme', args: { label: '4' } },
  });
  const ok = examineFigureItem(mc);
  assert.equal(ok.derivation.status, 'derived', JSON.stringify(ok));
  assert.deepEqual(ok.defects, []);
  assert.equal(examineFigureItem({ ...mc, answer: 'A' }).derivation.status, 'mismatch');
  const op = item(fx('operon-blank-trp-transcription'), {
    responseFormat: 'mcq', problemText: 'The figure shows the trp operon when tryptophan is plentiful. What is the state of transcription of the five genes, marked "?" in the figure?', choices: ['on', 'off'], answer: 'B',
    alt: 'The trp operon with a repressor on the operator.', derivation: { checker: 'operon_transcription', args: {} },
  });
  assert.equal(examineFigureItem(op).derivation.status, 'derived', JSON.stringify(examineFigureItem(op)));
  assert.equal(examineFigureItem({ ...op, answer: 'A' }).derivation.status, 'mismatch');
  const cyc = item(fx('cycle-blank-duration-s'), { responseFormat: 'numeric', problemText: 'One full cycle of the cell shown takes 24 hours. How many hours does S phase, marked "?" in the figure, last?', answer: '8', alt: 'A cell-cycle wheel with one duration left blank.', derivation: { checker: 'cycle_duration', args: { phase: 'S' } } });
  assert.equal(examineFigureItem(cyc).derivation.status, 'derived', JSON.stringify(examineFigureItem(cyc)));
  assert.equal(examineFigureItem({ ...cyc, answer: '6' }).derivation.status, 'mismatch');
  assert.equal(examineFigureItem({ ...cyc, derivation: { checker: 'fork_end', args: {} } }).derivation.status, 'error');
});

test('every checker of the part was exercised above', () => {
  for (const name of Object.keys(PART.checkers)) assert.ok(used.has(name), `${name} has no test`);
});

console.log(`${passed} figure-core-batch5-bio test(s) passed${process.exitCode ? ' — WITH FAILURES' : ''}`);
