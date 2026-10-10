/**
 * Practice-figure renderer — batch 5, part "bio" (2026-10-16):
 * replication_fork, operon_map and cell_cycle_wheel.
 *
 * Under test: the shared invariants of every fixture of the part
 * (scripts/lib/practice-figure-test-kit.ts); per kind what is drawn, what
 * each option hides, the model behind the picture, the refusals (each names
 * its param) and the kind's own legibility notes.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch5-bio.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { cycleModel, cycleSpans } from '../src/lib/tutor/practice-figure/kinds/cell-cycle';
import { operonDrawn, operonModel } from '../src/lib/tutor/practice-figure/kinds/operon-map';
import { END_TRUTH, FORK_ENDS, forkFragments, forkModel, forkPolaritySettled } from '../src/lib/tutor/practice-figure/kinds/replication-fork';
import { FIXTURES } from './lib/practice-figure-fixtures-b5-bio';
import { count, fixtureInvariants, has, makeRunner, near, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const GROUPS: Record<string, string> = { replication_fork: 'fork-', operon_map: 'operon-', cell_cycle_wheel: 'cycle-' };

console.log('\nEvery fixture of the part:\n');
const rendered = fixtureInvariants(test, FIXTURES, GROUPS, [], 'fix5');
const svg = (id: string): string => rendered.get(id) ?? assert.fail(`no fixture ${id}`);
const BLANK_BOX = /stroke-dasharray="3 2"\/>/g;
const ARROW_HEAD = /<polygon points="[^"]*" fill="#1d4ed8"\/>/g;
const NEW_STRAND = /stroke="#1d4ed8"/g;

console.log('\nreplication_fork:\n');

test('fork: by default the four parental ends are printed and nothing else — one continuous new strand and three pieces, all arrows', () => {
  const s = svgOf('replication_fork', {});
  assert.deepEqual(texts(s).sort(), ['3′', '3′', '5′', '5′']);
  assert.equal(count(s, NEW_STRAND), 4, 'one leading strand + three fragments');
  assert.equal(count(s, ARROW_HEAD), 4);
  assert.equal(count(s, /<rect /g), 1, 'the background only: no marker');
  assert.equal(count(s, /<circle /g), 0);
  const m = forkModel(reader('replication_fork', {}));
  assert.deepEqual([m.leading, m.direction, m.fragments, m.arrows, m.primers], ['top', 'right', 3, true, false]);
  for (const e of FORK_ENDS) assert.equal(m.ends[e], e.startsWith('template_') ? 'value' : 'none', e);
});

test('fork: the polarity model — a new strand is antiparallel to its template; both new strands start 5′', () => {
  assert.deepEqual([END_TRUTH.template_leading_open, END_TRUTH.leading_start], ['3′', '5′']);
  assert.deepEqual([END_TRUTH.template_leading_parental, END_TRUTH.leading_tip], ['5′', '3′']);
  assert.deepEqual([END_TRUTH.template_lagging_open, END_TRUTH.lagging_tip], ['5′', '3′']);
  assert.deepEqual([END_TRUTH.template_lagging_parental, END_TRUTH.lagging_start], ['3′', '5′']);
  // The two parental strands are antiparallel to each other, end for end.
  assert.notEqual(END_TRUTH.template_leading_open, END_TRUTH.template_lagging_open);
  assert.notEqual(END_TRUTH.template_leading_parental, END_TRUTH.template_lagging_parental);
});

test('fork: the fragments — newest nearest the fork, each running away from it, equal lengths, gaps between', () => {
  for (const n of [1, 2, 3, 4]) {
    const f = forkFragments(n);
    assert.equal(f.length, n);
    for (const [a, b] of f) assert.ok(a > b, 'start (5′) nearer the fork than the tip');
    for (let i = 1; i < n; i++) {
      near(f[i - 1][1] - f[i][0], 8, 1e-9);
      near(f[i][0] - f[i][1], f[0][0] - f[0][1], 1e-9);
    }
    assert.ok(f[0][0] - f[0][1] >= 20, 'long enough for an arrowhead');
  }
});

test('fork: each option hides what it says — ends, arrowheads, names', () => {
  assert.deepEqual(texts(svgOf('replication_fork', { templateEnds: 'none' })), []);
  const blank = svgOf('replication_fork', { templateEnds: 'blank' });
  assert.equal(count(blank, BLANK_BOX), 4);
  assert.ok(!has(blank, '5′') && !has(blank, '3′'));
  const one = svg('fork-blank-template-end');
  assert.equal(count(one, BLANK_BOX), 1);
  assert.deepEqual(texts(one).filter((t) => /′/.test(t)).sort(), ['3′', '3′', '5′']);
  const all = svgOf('replication_fork', { newEnds: 'value' });
  assert.equal(texts(all).filter((t) => t === '5′').length, 4);
  assert.equal(texts(all).filter((t) => t === '3′').length, 4);
  const plain = svg('fork-blank-direction-enzyme');
  assert.equal(count(plain, ARROW_HEAD), 0, 'no arrowheads');
  assert.equal(count(plain, NEW_STRAND), 3, 'the leading strand and two fragments');
  // A numbered marker names no enzyme anywhere in the picture.
  assert.ok(!/helicase|primase|polymerase|ligase|Okazaki/.test(svg('fork-dense-numbered-enzymes')));
  assert.ok(!/leading|lagging/.test(svg('fork-simple-lettered-strands')));
});

test('fork: the markers are four different shapes — wedge, disc, square, diamond; a null label leaves a bare marker', () => {
  const s = svg('fork-dense-numbered-enzymes');
  const FILL = 'fill="#e5e7eb" stroke="#111827"';
  assert.equal(count(s, new RegExp(`<polygon points="[\\d., ]+" ${FILL}`, 'g')), 2, 'wedge and diamond');
  assert.equal([...s.matchAll(new RegExp(`<polygon points="([\\d., ]+)" ${FILL}`, 'g'))].map((q) => q[1].split(' ').length).sort().join(), '3,4');
  assert.equal(count(s, new RegExp(`<circle [^>]*r="9.5" ${FILL}`, 'g')), 1);
  assert.equal(count(s, new RegExp(`<rect [^>]*width="13" height="13" ${FILL}`, 'g')), 1);
  for (const t of ['1', '2', '3', '4', 'Z', 'leading strand', 'lagging strand', '= RNA primer']) assert.ok(has(s, t), t);
  // Primers: one thick block per new piece (1 + 3) and one in the key.
  assert.equal(count(s, /stroke-width="5.5"/g), 5);
  assert.equal(count(svgOf('replication_fork', { primers: true, primerKey: false }), /stroke-width="5.5"/g), 4);
  const bare = svgOf('replication_fork', { templateEnds: 'none', enzymes: [{ type: 'helicase', label: null }, { type: 'polymerase', label: null }] });
  assert.deepEqual(texts(bare), []);
  assert.equal(count(bare, /fill="#e5e7eb"/g), 2);
  const named = svg('fork-named-enzymes-fragment');
  for (const t of ['helicase', 'DNA polymerase', 'primase', 'DNA ligase', 'Okazaki fragment']) assert.ok(has(named, t), t);
});

test('fork: mirroring — forkDirection: left puts the duplex on the left; leading: bottom swaps the arms; the labels follow', () => {
  const xs = (s: string, t: string): number[] => [...s.matchAll(/<text x="([\d.]+)" y="([\d.]+)"[^>]*>([^<]*)<\/text>/g)].filter((q) => q[3] === t).map((q) => Number(q[1]));
  const right = svgOf('replication_fork', {});
  const left = svgOf('replication_fork', { forkDirection: 'left' });
  // Parental-duplex labels are on the duplex side.
  assert.ok(Math.max(...xs(right, '5′')) > 300 && Math.min(...xs(left, '5′')) < 60);
  const ys = (s: string): number[] => [...s.matchAll(/<path d="M[\d.]+,([\d.]+)L[\d.]+,[\d.]+L[\d.]+,[\d.]+" fill="none" stroke="#111827" stroke-width="2.6"/g)].map((q) => Number(q[1]));
  assert.equal(ys(right).length, 2);
  // The leading template is drawn first: its open end is the upper one by default, the lower one with leading: bottom.
  assert.ok(ys(right)[0] < ys(right)[1]);
  const flipped = ys(svgOf('replication_fork', { leading: 'bottom' }));
  assert.ok(flipped[0] > flipped[1]);
});

test('fork: refusals name the param', () => {
  throwsSpec('replication_fork', { fragments: 0 }, /fragments must be a whole number from 1 to 4/);
  throwsSpec('replication_fork', { fragments: 2.5 }, /fragments must be a whole number/);
  throwsSpec('replication_fork', { leading: 'left' }, /leading must be one of top, bottom/);
  throwsSpec('replication_fork', { forkDirection: 'up' }, /forkDirection must be one of right, left/);
  throwsSpec('replication_fork', { templateEnds: 'yes' }, /templateEnds must be one of value, blank, none/);
  throwsSpec('replication_fork', { ends: { top_left: 'blank' } }, /ends\.top_left is not an end of the figure — one of template_leading_open/);
  throwsSpec('replication_fork', { ends: { leading_tip: 'hidden' } }, /ends\.leading_tip must be one of/);
  throwsSpec('replication_fork', { enzymes: [{ type: 'gyrase' }] }, /enzymes\[0\]\.type must be one of helicase, primase, polymerase, ligase/);
  throwsSpec('replication_fork', { enzymes: [{}] }, /enzymes\[0\]\.type must be one of/);
  throwsSpec('replication_fork', { enzymes: [{ type: 'helicase' }, { type: 'helicase', label: '2' }] }, /enzymes\[1\]: helicase is marked twice/);
  throwsSpec('replication_fork', { fragments: 1, enzymes: [{ type: 'ligase' }] }, /ligase joins two fragments — give fragments ≥ 2/);
  throwsSpec('replication_fork', { enzymes: [{ type: 'helicase', label: '1' }, { type: 'primase', label: '1' }] }, /two markers carry the same label/);
  throwsSpec('replication_fork', { strandLabels: { leading: 'X', lagging: 'X' } }, /the two strands carry the same name/);
  throwsSpec('replication_fork', { strandLabels: { template: 'T' } }, /strandLabels\.template: only "leading" and "lagging"/);
  throwsSpec('replication_fork', { strandLabels: { leading: 'the leading strand of DNA' } }, /strandLabels\.leading is longer than 16 characters/);
});

test('fork: legibility — a blank end with nothing to fix the polarity; a strand name too long for the mouth of the fork', () => {
  assert.deepEqual(warn('replication_fork', { templateEnds: 'blank', arrows: false }), ['ambiguous_blank']);
  assert.deepEqual(warn('replication_fork', { templateEnds: 'blank' }), [], 'the arrowheads fix it');
  assert.deepEqual(warn('replication_fork', { arrows: false, ends: { template_lagging_open: 'blank' } }), [], 'the other printed ends fix it');
  assert.equal(forkPolaritySettled(forkModel(reader('replication_fork', { templateEnds: 'none', arrows: false }))), false);
  assert.deepEqual(warn('replication_fork', { strandLabels: { leading: 'WWWWWWWWWWWWWWWW' } }), ['crowded']);
  // The longest default names fit in every mirror image.
  for (const leading of ['top', 'bottom']) for (const forkDirection of ['right', 'left']) {
    assert.deepEqual(warn('replication_fork', { leading, forkDirection, fragments: 4, newEnds: 'value', primers: true, fragmentLabel: 'Okazaki fragment', strandLabels: { leading: 'leading strand', lagging: 'lagging strand' }, enzymes: [{ type: 'helicase' }, { type: 'polymerase' }, { type: 'primase' }, { type: 'ligase' }] }), [], `${leading}/${forkDirection}`);
  }
});

console.log('\noperon_map:\n');

const om = (params: Params) => operonModel(reader('operon_map', params));

test('operon: the state is computed — the lac truth table (lactose × glucose) and the trp one', () => {
  const lac = (lactose: boolean, glucose: boolean) => om({ system: 'lac', lactose, glucose }).state;
  assert.deepEqual([lac(false, false).repressorBound, lac(false, false).level], [true, 'off']);
  assert.deepEqual([lac(false, true).repressorBound, lac(false, true).level], [true, 'off']);
  assert.deepEqual([lac(true, false).repressorBound, lac(true, false).capBound, lac(true, false).level], [false, true, 'high']);
  assert.deepEqual([lac(true, true).repressorBound, lac(true, true).capBound, lac(true, true).level], [false, false, 'low']);
  assert.deepEqual([om({ system: 'trp' }).state.repressorBound, om({ system: 'trp' }).state.level], [false, 'on']);
  assert.deepEqual([om({ system: 'trp', tryptophan: true }).state.repressorBound, om({ system: 'trp', tryptophan: true }).state.level], [true, 'off']);
  // Mutants.
  assert.deepEqual([om({ system: 'lac', mutation: 'regulator' }).state.repressorMade, om({ system: 'lac', mutation: 'regulator' }).state.level], [false, 'high']);
  assert.deepEqual([om({ system: 'lac', mutation: 'operator' }).state.repressorBound, om({ system: 'lac', mutation: 'operator' }).state.level], [false, 'high']);
  assert.equal(om({ system: 'lac', lactose: true, mutation: 'promoter' }).state.level, 'off');
  assert.equal(om({ system: 'trp', tryptophan: true, mutation: 'regulator' }).state.level, 'on');
});

test('operon: what is drawn follows the state — repressor on or off the operator, the triangle, CAP, RNAP, the arrow', () => {
  const off = svg('operon-simple-lac-repressed');
  assert.deepEqual(texts(off), ['lacI', 'P', 'O', 'lacZ', 'lacY', 'lacA', 'R = repressor', 'R', 'no transcription']);
  assert.equal(count(off, /<polygon points="[^"]*" fill="#111827"\/>/g), 0, 'no arrowhead, no triangle');
  const on = svg('operon-dense-lac-induced-cap');
  for (const t of ['lactose present, glucose absent', 'CAP site', 'CAP', 'RNAP', 'R', 'transcription', 'R = repressor', 'RNAP = RNA polymerase', 'CAP = activator protein', '= allolactose']) assert.ok(has(on, t), t);
  assert.equal(count(on, /<polygon points="[^"]*" fill="#111827"\/>/g), 3, 'the arrowhead, the triangle on the repressor, the triangle of the key');
  // The pill: on the operator when bound (its bottom on the top edge of the boxes), well above it when free.
  const pillY = (s: string): number => Number(/<rect x="[\d.]+" y="([\d.]+)" width="32" height="20" rx="7"/.exec(s)?.[1]);
  const boxY = (s: string): number => Number(/<rect x="[\d.]+" y="([\d.]+)" width="[\d.]+" height="24" fill/.exec(s)?.[1]);
  near(pillY(off) + 20, boxY(off) - 0.5, 1e-6);
  assert.ok(pillY(on) + 20 < boxY(on) - 25);
  const low = svg('operon-lac-low-glucose-present');
  assert.ok(has(low, 'low transcription') && /stroke-dasharray="5 4"/.test(low) && !has(low, 'CAP') && has(low, 'CAP site'));
  const d = operonDrawn(om({ system: 'lac', lactose: true, glucose: true, capSite: true }));
  assert.deepEqual(d, { repressor: true, effector: true, cap: false, polymerase: true });
  const mutant = svg('operon-trp-operator-mutant');
  assert.ok(has(mutant, '= mutation (function lost)') && has(mutant, '= tryptophan') && has(mutant, 'transcription'));
  // The regulator mutant: no repressor is drawn at all.
  assert.ok(!has(svgOf('operon_map', { system: 'lac', mutation: 'regulator' }), 'R'));
});

test('operon: each option hides what it says — the arrow, the repressor, a box name, a protein tag, the key of the triangle', () => {
  const blank = svg('operon-blank-trp-transcription');
  assert.equal(count(blank, BLANK_BOX), 1);
  assert.ok(!has(blank, 'no transcription') && !has(blank, 'transcription') && !has(blank, 'RNAP'), 'the state is not printed and RNA polymerase is not drawn');
  // … and with the genes ON, the blank figure is the same but for the repressor: RNA polymerase would give it away.
  assert.ok(!has(svgOf('operon_map', { system: 'trp', transcription: 'blank' }), 'RNAP'));
  const none = svgOf('operon_map', { system: 'lac', lactose: true, transcription: 'none' });
  assert.ok(!has(none, 'transcription') && !has(none, 'RNAP') && count(none, BLANK_BOX) === 0);
  const noRep = svgOf('operon_map', { system: 'lac', showRepressor: false, showConditions: true });
  assert.ok(!has(noRep, 'R') && !has(noRep, 'R = repressor') && has(noRep, 'lactose absent, glucose absent'));
  const numbered = svg('operon-blank-operator-numbered');
  assert.deepEqual(texts(numbered), ['lacI', '1', '?', '2', '3', '4', 'X']);
  assert.ok(!/repressor/.test(numbered), 'a tag the author gave has no key entry');
  const eff = svgOf('operon_map', { system: 'trp', tryptophan: true, labels: { effector: '?' } });
  assert.ok(!has(eff, '= tryptophan') && count(eff, BLANK_BOX) === 1);
  assert.ok(!/tryptophan/.test(svgOf('operon_map', { system: 'trp', tryptophan: true, labels: { effector: null } })));
  assert.ok(has(svgOf('operon_map', { system: 'lac', labels: { repressor: '?' } }), '?'));
  assert.ok(!has(svgOf('operon_map', { system: 'lac', lactose: true, showPolymerase: false }), 'RNAP'));
});

test('operon: the strip — default and custom genes, the CAP site only when asked, gene names in italics', () => {
  assert.deepEqual(om({ system: 'trp' }).genes, ['trpE', 'trpD', 'trpC', 'trpB', 'trpA']);
  assert.deepEqual(om({ system: 'lac' }).labels.regulator, 'lacI');
  const custom = svgOf('operon_map', { system: 'lac', genes: ['Z', 'Y'], transcription: 'none', showRepressor: false });
  assert.deepEqual(texts(custom), ['lacI', 'P', 'O', 'Z', 'Y']);
  assert.equal(count(svg('operon-simple-lac-repressed'), /font-style="italic"/g), 4, 'lacI, lacZ, lacY, lacA');
  assert.equal(count(svg('operon-simple-lac-repressed'), /height="24" fill="#eef2f6"/g), 2, 'promoter and operator shaded');
  assert.equal(count(svg('operon-dense-lac-induced-cap'), /height="24" fill="#eef2f6"/g), 3);
});

test('operon: refusals name the param', () => {
  throwsSpec('operon_map', {}, /system must be "lac" or "trp"/);
  throwsSpec('operon_map', { system: 'trp', lactose: true }, /lactose does not apply to the trp operon/);
  throwsSpec('operon_map', { system: 'trp', capSite: true }, /capSite does not apply to the trp operon/);
  throwsSpec('operon_map', { system: 'lac', tryptophan: false }, /tryptophan does not apply to the lac operon/);
  throwsSpec('operon_map', { system: 'lac', lactose: 'yes' }, /lactose must be true or false/);
  throwsSpec('operon_map', { system: 'lac', mutation: 'gene' }, /mutation must be one of regulator, operator, promoter/);
  throwsSpec('operon_map', { system: 'lac', transcription: 'on' }, /transcription must be one of value, blank, none/);
  throwsSpec('operon_map', { system: 'lac', genes: [] }, /genes must have between 1 and 6 entries/);
  throwsSpec('operon_map', { system: 'lac', genes: ['lacZYA-long'] }, /genes\[0\] is longer than 6 characters/);
  throwsSpec('operon_map', { system: 'lac', capSite: true, genes: ['a', 'b', 'c', 'd', 'e'] }, /genes: at most 4 fit beside a CAP site/);
  throwsSpec('operon_map', { system: 'lac', labels: { genes: ['1', '2'] } }, /labels\.genes must have between 3 and 3 entries/);
  throwsSpec('operon_map', { system: 'lac', labels: { capSite: 'C' } }, /labels\.capSite: the CAP site is not drawn/);
  throwsSpec('operon_map', { system: 'lac', labels: { terminator: 'T' } }, /labels\.terminator is not a label of the figure/);
  throwsSpec('operon_map', { system: 'lac', labels: { promoter: '1', operator: '1' } }, /two boxes of the strip carry the same text/);
});

test('operon: legibility — a "?" arrow with neither the repressor nor the conditions shown; a name too wide for its box', () => {
  assert.deepEqual(warn('operon_map', { system: 'lac', transcription: 'blank', showRepressor: false }), ['ambiguous_blank']);
  assert.deepEqual(warn('operon_map', { system: 'lac', transcription: 'blank', showRepressor: false, showConditions: true }), []);
  assert.deepEqual(warn('operon_map', { system: 'lac', genes: ['WWWWWW', 'b', 'c', 'd', 'e', 'f'] }), ['crowded']);
  // Every state of both systems, with and without the CAP site, is clean.
  for (const lactose of [false, true]) for (const glucose of [false, true]) for (const capSite of [false, true]) for (const mutation of [undefined, 'regulator', 'operator', 'promoter']) {
    assert.deepEqual(warn('operon_map', { system: 'lac', lactose, glucose, capSite, mutation, showConditions: true }), [], JSON.stringify({ lactose, glucose, capSite, mutation }));
  }
  for (const tryptophan of [false, true]) for (const mutation of [undefined, 'regulator', 'operator', 'promoter']) assert.deepEqual(warn('operon_map', { system: 'trp', tryptophan, mutation, showConditions: true }), []);
});

console.log('\ncell_cycle_wheel:\n');

const cm = (params: Params) => cycleModel(reader('cell_cycle_wheel', params));

test('wheel: the default is G1 11 h, S 8 h, G2 4 h, M 1 h; sectors in proportion, clockwise from the top', () => {
  const m = cm({});
  assert.deepEqual(m.phases.map((p) => [p.name, p.duration, p.label, p.showDuration]), [['G1', 11, 'G1', 'value'], ['S', 8, 'S', 'value'], ['G2', 4, 'G2', 'value'], ['M', 1, 'M', 'value']]);
  assert.equal(m.total, 24);
  const spans = cycleSpans(m);
  near(spans[0][0], 0);
  near(spans[0][1], 11 / 24);
  near(spans[2][1], 23 / 24);
  near(spans[3][1], 1);
  const s = svg('cycle-simple-four-phases');
  assert.deepEqual(texts(s).sort(), ['1 h', '11 h', '4 h', '8 h', 'G1', 'G2', 'M', 'S']);
  // One sector outline per phase; the first is plain, the other three hatched under a clip path each.
  assert.equal(count(s, /<clipPath /g), 3);
  assert.equal(count(s, /A76,76 0 [01] 1 /g), 4 + 4 + 3, 'each sector path is used as fill, as outline, and (the hatched ones) as clip');
  // The first sector starts at the top of the ring (x = 180) and runs clockwise (to the right).
  assert.ok(/<path d="M180,[\d.]+A76,76 0 0 1 (\d+)/.test(s) && Number(/<path d="M180,[\d.]+A76,76 0 0 1 (\d+)/.exec(s)?.[1]) > 180);
});

test('wheel: scale equal draws same-size sectors and prints "not to scale"; the model keeps the true durations', () => {
  const m = cm({ scale: 'equal' });
  for (const [a, b] of cycleSpans(m)) near(b - a, 0.25);
  assert.equal(m.total, 24);
  assert.ok(has(svg('cycle-blank-name-equal-not-to-scale'), 'not to scale'));
  assert.ok(!has(svg('cycle-simple-four-phases'), 'not to scale'));
});

test('wheel: each option hides what it says — a duration, every duration, a name, the cycle length', () => {
  const one = svg('cycle-blank-duration-s');
  assert.equal(count(one, BLANK_BOX), 1);
  assert.ok(!has(one, '8 h') && has(one, '10 h') && has(one, '24 h') && has(one, 'one cycle'));
  const none = svgOf('cell_cycle_wheel', { durations: 'none' });
  assert.deepEqual(texts(none).sort(), ['G1', 'G2', 'M', 'S']);
  assert.equal(count(svgOf('cell_cycle_wheel', { durations: 'blank' }), BLANK_BOX), 4);
  const named = svg('cycle-blank-name-equal-not-to-scale');
  assert.deepEqual(texts(named).filter((t) => t !== 'not to scale').sort(), ['1', '2', '?', 'G1', 'M', 'X']);
  assert.ok(!has(named, 'S') && !has(named, 'G2'));
  const total = svg('cycle-blank-total-short-m');
  assert.ok(has(total, 'one cycle') && !has(total, '16 h') && count(total, BLANK_BOX) === 1);
  assert.deepEqual(texts(svgOf('cell_cycle_wheel', { durations: 'none', phases: [{ name: 'G1', duration: 1, label: null }, { name: 'S', duration: 1, label: null }, { name: 'G2', duration: 1, label: null }] })), []);
});

test('wheel: checkpoints are filled triangles on the rim at a boundary or the middle of a phase; a long name is set on two lines; the interphase arc', () => {
  const m = cm({ checkpoints: [{ at: 'G1/S' }, { at: 'G2/M', label: '2' }, { at: 'M', label: null }] });
  near(m.checkpoints[0].fraction, 11 / 24);
  near(m.checkpoints[1].fraction, 23 / 24);
  near(m.checkpoints[2].fraction, 23.5 / 24);
  assert.deepEqual(m.checkpoints.map((c) => c.label), ['G1/S checkpoint', '2', null]);
  // The boundary that closes the ring: M back to G1 is at the top.
  near(cm({ checkpoints: [{ at: 'M/G1' }] }).checkpoints[0].fraction, 0);
  const s = svg('cycle-dense-checkpoints-interphase');
  assert.equal(count(s, /<polygon points="[^"]*" fill="#111827"\/>/g), 3);
  for (const t of ['G1/S', 'G2/M', 'M', 'checkpoint', 'interphase', 'one cycle', '24 h']) assert.ok(has(s, t), t);
  assert.equal(texts(s).filter((t) => t === 'checkpoint').length, 3);
  assert.equal(cm({ interphase: true }).interphase, 'interphase');
  assert.ok(has(svgOf('cell_cycle_wheel', { interphase: '?' }), '?'));
});

test('wheel: refusals name the param', () => {
  throwsSpec('cell_cycle_wheel', { phases: [{ name: 'G1', duration: 1 }] }, /phases must have between 3 and 6 entries/);
  throwsSpec('cell_cycle_wheel', { phases: [{ name: 'G1', duration: 0 }, { name: 'S', duration: 1 }, { name: 'M', duration: 1 }] }, /phases\[0\]\.duration must be greater than 0/);
  throwsSpec('cell_cycle_wheel', { phases: [{ name: 'G1', duration: 1 }, { name: 'G1', duration: 1 }, { name: 'M', duration: 1 }] }, /two phases have the same name/);
  throwsSpec('cell_cycle_wheel', { phases: [{ name: 'G1', duration: 1, label: 'X' }, { name: 'S', duration: 1, label: 'X' }, { name: 'M', duration: 1 }] }, /two sectors print the same label/);
  throwsSpec('cell_cycle_wheel', { durations: 'hidden' }, /durations must be one of value, blank, none/);
  throwsSpec('cell_cycle_wheel', { scale: 'log' }, /scale must be one of proportional, equal/);
  throwsSpec('cell_cycle_wheel', { total: 'yes' }, /total must be one of value, blank, none/);
  throwsSpec('cell_cycle_wheel', { checkpoints: [{ at: 'G1/G2' }] }, /checkpoints\[0\]\.at \("G1\/G2"\) must name two phases that follow one another \(G1\/S, S\/G2, G2\/M, M\/G1\)/);
  throwsSpec('cell_cycle_wheel', { checkpoints: [{ at: 'G0' }] }, /checkpoints\[0\]\.at \("G0"\) must name a phase \(G1, S, G2, M\)/);
  throwsSpec('cell_cycle_wheel', { checkpoints: [{ at: 'M' }, { at: 'M', label: '2' }] }, /the same place is marked twice/);
  throwsSpec('cell_cycle_wheel', { interphase: true, phases: [{ name: 'G1', duration: 1 }, { name: 'G2', duration: 1 }, { name: 'S', duration: 1 }, { name: 'M', duration: 1 }] }, /interphase: the arc spans G1, S and G2/);
  throwsSpec('cell_cycle_wheel', { unit: 'minutes' }, /unit is longer than 6 characters/);
});

test('wheel: legibility — a sliver of a sector warns and points at scale: equal; ordinary cycles are clean', () => {
  const sliver = { phases: [{ name: 'G1', duration: 30 }, { name: 'S', duration: 12 }, { name: 'G2', duration: 5 }, { name: 'M', duration: 0.5 }] };
  assert.deepEqual(warn('cell_cycle_wheel', sliver), ['crowded']);
  assert.deepEqual(warn('cell_cycle_wheel', { ...sliver, scale: 'equal' }), []);
  for (const checkpoints of [[], [{ at: 'G1/S' }, { at: 'G2/M' }, { at: 'M' }], [{ at: 'G1/S', label: '1' }, { at: 'G2/M', label: '2' }, { at: 'M', label: '3' }]]) {
    for (const total of ['none', 'value', 'blank']) for (const interphase of [false, true]) for (const scale of ['proportional', 'equal']) {
      assert.deepEqual(warn('cell_cycle_wheel', { checkpoints, total, interphase, scale }), [], JSON.stringify({ checkpoints, total, interphase, scale }));
    }
  }
});

void finish();
