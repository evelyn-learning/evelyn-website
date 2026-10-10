/**
 * Tests for scripts/practice-extend/figure-core-batch4-wave.ts (wave_diagram),
 * reached the way the job reaches it — through figure-core.ts.
 *
 * Per checker: at least one right key accepted and one wrong key rejected;
 * textbook-standard cases with known answers; the transcription says what is
 * printed, keeps a blank blank and never names what a question asks for.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch4-wave.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b4-wave';
import { BATCH4_CHECKERS, FigureRuleError, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART } from './figure-core-batch4-wave';

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
    objectiveLoId: 'gen-x.lo-1', responseFormat: 'numeric', problemText: 'Use the figure shown. What value does it give?', answer: '0', choices: [], hints: ['Read the figure.'],
    solutionText: 'Work it out from the figure.', difficulty: 2, covers: 'reading the figure', taskType: 'read a value', distractorRationales: [],
    figureSpec: spec, alt: 'A figure.', derivation: { checker: 'none', args: {} }, ...over,
  };
}
/** Right key accepted, wrong key rejected — for one checker on one spec. */
function rw(spec: PracticeFigureSpec, checker: string, args: Args, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  assert.equal(compareDerived(item(spec, { answer: right }), d).match, true, `${checker} ${JSON.stringify(args)}: "${right}" should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { answer: wrong }), d).match, false, `${checker} ${JSON.stringify(args)}: "${wrong}" should not match ${JSON.stringify(d)}`);
}
const W = (params: Args): PracticeFigureSpec => ({ type: 'wave_diagram', params });
const T = (params: Args): PracticeFigureSpec => W({ variant: 'transverse', ...params });
const St = (params: Args): PracticeFigureSpec => W({ variant: 'standing', ...params });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;

test('registration: the part speaks for wave_diagram; its checkers are in BATCH4_CHECKERS and in the catalogue', () => {
  assert.deepEqual([...PART.kinds], ['wave_diagram']);
  for (const k of Object.keys(PART.checkers)) assert.equal(BATCH4_CHECKERS[k], PART.checkers[k], k);
  const cat = checkerCatalogue(['wave_diagram']);
  for (const k of Object.keys(PART.checkers)) assert.ok(cat.includes(`- ${k} `), k);
  refused(() => run({ type: 'bar_chart', params: { categories: ['a'], values: [1] } }, 'wave_amplitude'), /is for wave_diagram, not for bar_chart/);
});

test('transcription: says what is printed; a "?" stays a blank; hidden values are never named', () => {
  const simple = textOf(fx('wave-transverse-simple'));
  assert.ok(/The figure is a diagram of a transverse wave\./.test(simple));
  assert.ok(simple.includes('amplitude label: "0.2 m"') && simple.includes('wavelength label: "1.5 m"'));
  assert.ok(/2 full cycles, with 2 crests and 2 troughs/.test(simple));
  const blank = textOf(fx('wave-transverse-blank-wavelength'));
  assert.ok(blank.includes('wavelength label: (blank — a "?" box)') && !blank.includes('2.4'), 'the hidden wavelength is not in the text');
  assert.ok(blank.includes('arrow label: "v = 12 m/s"') && /points to the right/.test(blank));
  const time = textOf(fx('wave-transverse-time-blank-amplitude'));
  assert.ok(/The figure is a displacement–time record of a wave\./.test(time) && time.includes('period label: "0.4 s"'));
  assert.ok(time.includes('amplitude label: (blank — a "?" box)') && !/\b5 cm/.test(time));
  const scale = textOf(fx('wave-transverse-scale-read-off'));
  assert.ok(scale.includes('x-axis label: "Position (m)"') && scale.includes('"Displacement (cm)" from -6 to 6 in steps of 2'));
  assert.ok(/The crests reach 4 and the troughs -4/.test(scale) && /Crests at x = 0\.5, 2\.5; troughs at 1\.5, 3\.5/.test(scale));
  assert.ok(/lettered "Q" is on the equilibrium line, where the curve is falling to the right \(at x = 3\)/.test(scale));
  const dense = textOf(fx('wave-transverse-dense-labels-points'));
  for (const w of ['word: "crest"', 'word: "trough"', 'word: "equilibrium position"', 'point label: "P"', 'point label: "Q"']) assert.ok(dense.includes(w), w);
  assert.ok(/lettered "P" is in a trough/.test(dense));
  // Standing waves: shapes and counts, never the harmonic number unless it is printed.
  const third = textOf(fx('wave-standing-simple-third-harmonic'));
  assert.ok(/The figure is a standing-wave diagram\./.test(third) && /the curves form 3 loops; 4 filled dots/.test(third) && third.includes('length label: "1.2 m"'));
  assert.ok(!/n = 3|third|harmonic/.test(third));
  const pipe = textOf(fx('wave-standing-blank-pipe-closed'));
  assert.ok(pipe.includes('row label: "n =" (blank — a "?" box)') && pipe.includes('length label: (blank — a "?" box)') && !pipe.includes('0.6'));
  assert.ok(/closed at its left end/.test(pipe) && /Row 2 .*1 whole loop and half a loop.*2 filled dots.*2 open rings/.test(pipe) && !/n = 3|n = 1/.test(pipe));
  const lettered = textOf(fx('wave-standing-open-pipe-lettered'));
  assert.ok(lettered.includes('node letter: "N"') && lettered.includes('antinode letter: "A"') && lettered.includes('length label: "L"'));
  assert.ok(/The length of the string is not marked/.test(textOf(St({ harmonics: [2] }))));
});

test('describeForAlt: names only what is printed, counts blanks, never a hidden value', () => {
  for (const f of FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600 && /^[A-Z]/.test(alt) && /\.$/.test(alt), `${f.id}: ${alt}`);
  }
  const blank = describeForAlt(fx('wave-transverse-blank-wavelength'));
  assert.ok(/One place is left blank/.test(blank) && !blank.includes('2.4') && blank.includes('"0.5 m"'), blank);
  const pipe = describeForAlt(fx('wave-standing-blank-pipe-closed'));
  assert.ok(/Three places are left blank/.test(pipe) && !pipe.includes('0.6'), pipe);
  assert.ok(!describeForAlt(fx('wave-transverse-simple'), { hide: ['1.5 m'] }).includes('1.5'));
});

test('wave_amplitude / wave_wavelength / wave_period: printed or read off the scale; refused when hidden', () => {
  rw(fx('wave-transverse-simple'), 'wave_amplitude', {}, '0.2', '0.4');
  rw(fx('wave-transverse-simple'), 'wave_wavelength', {}, '1.5', '0.75');
  rw(fx('wave-transverse-scale-read-off'), 'wave_amplitude', {}, '4', '8');   // not the crest-to-trough height
  rw(fx('wave-transverse-scale-read-off'), 'wave_wavelength', {}, '2', '4');
  rw(T({ axis: 'time', amplitude: 5, period: 0.4 }), 'wave_period', {}, '0.4', '0.2');
  refused(() => run(fx('wave-transverse-blank-wavelength'), 'wave_wavelength'), /hidden behind a "\?"/);
  refused(() => run(fx('wave-transverse-time-blank-amplitude'), 'wave_amplitude'), /hidden behind a "\?"/);
  refused(() => run(T({ amplitude: 1, wavelength: 2, showAmplitude: 'none' }), 'wave_amplitude'), /not marked/);
  refused(() => run(T({ amplitude: 3, wavelength: 2, scale: true, yStep: 4 }), 'wave_amplitude'), /not on a gridline/);
  refused(() => run(fx('wave-transverse-simple'), 'wave_period'), /shows a wavelength, not a period/);
  refused(() => run(T({ axis: 'time', amplitude: 5, period: 0.4 }), 'wave_wavelength'), /shows a period, not a wavelength/);
  // The hidden wavelength, from v and f the question states: 12 m/s ÷ 5 Hz = 2.4 m.
  rw(fx('wave-transverse-blank-wavelength'), 'wave_wavelength', { speed: 12, frequency: 5 }, '2.4', '60');
  refused(() => run(fx('wave-standing-simple-third-harmonic'), 'wave_amplitude'), /transverse variant/);
});

test('wave_speed / wave_frequency: v = fλ in textbook cases', () => {
  // λ = 1.5 m at 4 Hz → 6 m/s.
  rw(fx('wave-transverse-simple'), 'wave_speed', { frequency: 4 }, '6', '0.375');
  // λ = 2 m, T = 0.5 s → 4 m/s.
  rw(fx('wave-transverse-scale-read-off'), 'wave_speed', { period: 0.5 }, '4', '1');
  // Sound: 0.773 m at 440 Hz → about 340 m/s.
  rw(T({ amplitude: 1, wavelength: 0.773 }), 'wave_speed', { frequency: 440 }, '340.12', '569');
  // A time record: T = 0.4 s → f = 2.5 Hz; with λ = 3 m → 7.5 m/s.
  rw(fx('wave-transverse-time-blank-amplitude'), 'wave_frequency', {}, '2.5', '0.4');
  rw(fx('wave-transverse-time-blank-amplitude'), 'wave_speed', { wavelength: 3 }, '7.5', '1.2');
  // A snapshot: f = v/λ = 12 / 8 = 1.5 (cm/s over cm).
  rw(fx('wave-transverse-dense-labels-points'), 'wave_frequency', { speed: 12 }, '1.5', '96');
  refused(() => run(fx('wave-transverse-simple'), 'wave_speed'), /give "frequency" or "period"/);
  refused(() => run(fx('wave-transverse-simple'), 'wave_frequency'), /give the wave speed/);
  refused(() => run(fx('wave-transverse-blank-wavelength'), 'wave_speed', { frequency: 5 }), /hidden behind a "\?"/);
  refused(() => run(fx('wave-transverse-simple'), 'wave_speed', { frequency: -2 }), /greater than 0/);
});

test('wave_count, wave_point_displacement, wave_point_motion', () => {
  rw(fx('wave-transverse-dense-labels-points'), 'wave_count', { want: 'crests' }, '3', '2');
  rw(fx('wave-transverse-dense-labels-points'), 'wave_count', { want: 'troughs' }, '3', '2');   // the wave ends in its third trough
  rw(fx('wave-transverse-dense-labels-points'), 'wave_count', { want: 'cycles' }, '2.5', '3');
  rw(fx('wave-transverse-scale-read-off'), 'wave_point_displacement', { point: 'Q' }, '0', '4');
  rw(T({ amplitude: 4, wavelength: 2, scale: true, points: [{ x: 1.5, label: 'P' }] }), 'wave_point_displacement', { point: 'P' }, '-4', '4');
  refused(() => run(fx('wave-transverse-scale-read-off'), 'wave_point_displacement', { point: 'P' }), /not on a gridline crossing/);
  refused(() => run(fx('wave-transverse-dense-labels-points'), 'wave_point_displacement', { point: 'P' }), /no numbered axes/);
  refused(() => run(fx('wave-transverse-scale-read-off'), 'wave_point_displacement', { point: 'Z' }), /no point lettered "Z"/);
  // A wave going right: the point just ahead of a crest (on the falling side) is about to rise.
  const mcq = (spec: PracticeFigureSpec, point: string, right: string, wrong: string): void => {
    const d = run(spec, 'wave_point_motion', { point });
    assert.deepEqual(d, { kind: 'label', value: right });
    assert.equal(compareDerived(item(spec, { responseFormat: 'free', answer: right }), d).match, true);
    assert.equal(compareDerived(item(spec, { responseFormat: 'free', answer: wrong }), d).match, false);
  };
  mcq(fx('wave-transverse-dense-labels-points'), 'Q', 'up', 'down');          // falling to the right, wave → right
  mcq(fx('wave-transverse-dense-labels-points'), 'P', 'at rest', 'up');       // in a trough
  mcq(fx('wave-transverse-scale-read-off'), 'Q', 'down', 'up');               // same shape, wave → left
  mcq(fx('wave-transverse-scale-read-off'), 'P', 'down', 'up');               // falling to the right at x = 1.25, wave → left
  mcq(T({ amplitude: 1, wavelength: 4, points: [{ x: 0.5, label: 'K' }], direction: 'right' }), 'K', 'down', 'up');   // rising side, wave → right
  refused(() => run(T({ amplitude: 1, wavelength: 4, points: [{ x: 0.5, label: 'K' }] }), 'wave_point_motion', { point: 'K' }), /does not show which way the wave travels/);
});

test('standing waves: harmonic, counts, wavelength, length, frequency and speed — textbook cases', () => {
  const s3 = fx('wave-standing-simple-third-harmonic');   // string, n = 3, L = 1.2 m
  rw(s3, 'standing_harmonic', {}, '3', '4');
  rw(s3, 'standing_count', { want: 'nodes' }, '4', '3');
  rw(s3, 'standing_count', { want: 'antinodes' }, '3', '4');
  rw(s3, 'standing_count', { want: 'loops' }, '3', '6');
  rw(s3, 'standing_wavelength', {}, '0.8', '0.4');          // 2L/n
  rw(s3, 'standing_frequency', { speed: 240 }, '300', '200');   // 240 / 0.8
  rw(s3, 'standing_speed', { frequency: 300 }, '240', '360');
  rw(s3, 'standing_frequency', { fundamental: 110 }, '330', '36.67');
  rw(s3, 'standing_length', { wavelength: 0.8 }, '1.2', '2.4');
  // A guitar string: 0.65 m, fundamental, 143 m/s → 110 Hz.
  rw(St({ harmonics: [1], length: 0.65 }), 'standing_frequency', { speed: 143 }, '110', '220');
  // Three rows on a 0.9 m string: λ = 1.8, 0.9, 0.6 m.
  const three = fx('wave-standing-dense-three-harmonics');
  rw(three, 'standing_wavelength', { row: 0 }, '1.8', '0.9');
  rw(three, 'standing_wavelength', { row: 2 }, '0.6', '0.3');
  rw(three, 'standing_harmonic', { row: 1 }, '2', '3');
  // A tube open at both ends, 0.5 m, sound at 340 m/s: fundamental 340 Hz; second harmonic 680 Hz.
  rw(St({ medium: 'open_open', harmonics: [1, 2], length: 0.5 }), 'standing_frequency', { speed: 340, row: 0 }, '340', '170');
  rw(St({ medium: 'open_open', harmonics: [1, 2], length: 0.5 }), 'standing_frequency', { speed: 340, row: 1 }, '680', '340');
  rw(fx('wave-standing-open-pipe-lettered'), 'standing_count', { want: 'nodes' }, '2', '3');
  rw(fx('wave-standing-open-pipe-lettered'), 'standing_count', { want: 'antinodes' }, '3', '2');
  // A tube closed at one end, 0.6 m: λ₁ = 4L = 2.4 m; third harmonic λ = 0.8 m; with 340 m/s → 141.67 Hz and 425 Hz.
  const closed = St({ medium: 'open_closed', harmonics: [1, 3], length: 0.6 });
  rw(closed, 'standing_wavelength', { row: 0 }, '2.4', '1.2');
  rw(closed, 'standing_wavelength', { row: 1 }, '0.8', '0.4');
  rw(closed, 'standing_frequency', { speed: 340, row: 1 }, '425', '850');
  rw(closed, 'standing_frequency', { speed: 340, row: 0 }, '141.67', '283.3');
  rw(closed, 'standing_count', { want: 'nodes', row: 1 }, '2', '3');
  rw(closed, 'standing_count', { want: 'antinodes', row: 1 }, '2', '3');
  // The fixture hides the length: it is found from the wavelength of the lower wave (0.8 m, n = 3) — 0.6 m.
  const hidden = fx('wave-standing-blank-pipe-closed');
  rw(hidden, 'standing_length', { wavelength: 0.8, row: 1 }, '0.6', '1.2');
  refused(() => run(hidden, 'standing_wavelength', { row: 1 }), /hidden behind a "\?" — give it as the derivation argument "length"/);
  rw(hidden, 'standing_wavelength', { row: 1, length: 0.6 }, '0.8', '0.4');
  refused(() => run(fx('wave-standing-open-pipe-lettered'), 'standing_wavelength'), /only named "L"/);
  refused(() => run(closed, 'standing_count', { want: 'loops' }), /count for a string/);
  refused(() => run(s3, 'standing_frequency'), /give the wave speed/);
  refused(() => run(s3, 'standing_harmonic', { row: 2 }), /0-based index of a row/);
  refused(() => run(fx('wave-transverse-simple'), 'standing_harmonic'), /standing variant/);
  refused(() => run(St({ medium: 'open_closed', harmonics: [2] }), 'standing_harmonic'), /odd harmonics only/);
});

test('examineFigureItem: a right key is derived, a wrong key is a defect, a printed answer is caught by the refusal', () => {
  const spec = fx('wave-transverse-blank-wavelength');
  const ok = examineFigureItem(item(spec, { problemText: 'The wave shown has a frequency of 5 Hz. What is the wavelength marked "?" in the figure, in metres?', answer: '2.4', alt: describeForAlt(spec), derivation: { checker: 'wave_wavelength', args: { speed: 12, frequency: 5 } } }));
  assert.deepEqual(ok.defects, []);
  assert.equal(ok.derivation.status, 'derived');
  const bad = examineFigureItem(item(spec, { problemText: 'The wave shown has a frequency of 5 Hz. What is the wavelength marked "?" in the figure, in metres?', answer: '60', alt: describeForAlt(spec), derivation: { checker: 'wave_wavelength', args: { speed: 12, frequency: 5 } } }));
  assert.equal(bad.derivation.status, 'mismatch');
  const st = fx('wave-standing-simple-third-harmonic');
  const s = examineFigureItem(item(st, { problemText: 'The string in the figure vibrates as shown. What is the wavelength of the standing wave, in metres?', answer: '0.8', alt: describeForAlt(st), derivation: { checker: 'standing_wavelength', args: {} } }));
  assert.deepEqual(s.defects, []);
  assert.ok(s.figureText?.includes('standing-wave diagram'));
});

test('every checker of the part was exercised', () => {
  for (const k of Object.keys(PART.checkers)) assert.ok(used.has(k), `${k} has no test`);
});

console.log(`${passed} figure-core-batch4-wave test(s) passed`);
