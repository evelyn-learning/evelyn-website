/**
 * Tests for scripts/practice-extend/figure-core-batch5-em.ts (transformer,
 * induction_loop), reached the way the job reaches it — through figure-core.ts
 * (`describeFigure`, `describeForAlt`, `runChecker`, `compareDerived`,
 * `examineFigureItem`, `checkerCatalogue`, `axesOf`).
 *
 * Per checker: right keys accepted and wrong keys rejected, on textbook-standard
 * cases with known answers (three or more per checker); refusals when a value
 * is neither printed nor passed, or when the thing that fixes a direction is a
 * blank. Per kind: the transcription says what is printed, keeps a blank blank
 * and never names what a question asks for.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch5-em.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b5-em';
import { BATCH5_CHECKERS, FigureRuleError, axesOf, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART } from './figure-core-batch5-em';

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
    figureSpec: spec, alt: 'A sketch of the set-up.', derivation: { checker: 'none', args: {} }, ...over,
  };
}
/** Right key accepted, wrong key rejected — for one checker on one spec. */
function rw(spec: PracticeFigureSpec, checker: string, args: Args, right: string, wrong: string): void {
  const d = run(spec, checker, args);
  assert.equal(compareDerived(item(spec, { answer: right }), d).match, true, `${checker} ${JSON.stringify(args)}: "${right}" should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { answer: wrong }), d).match, false, `${checker} ${JSON.stringify(args)}: "${wrong}" should not match ${JSON.stringify(d)}`);
}
/** A word answer as a four-option question: the right option is keyed and accepted; keying another is a mismatch. */
function rwMcq(spec: PracticeFigureSpec, checker: string, args: Args, choices: string[], right: number): void {
  const d = run(spec, checker, args);
  assert.equal(compareDerived(item(spec, { responseFormat: 'mcq', choices, answer: 'ABCD'[right] }), d).match, true, `${checker}: option ${'ABCD'[right]} of ${JSON.stringify(choices)} should match ${JSON.stringify(d)}`);
  assert.equal(compareDerived(item(spec, { responseFormat: 'mcq', choices, answer: 'ABCD'[(right + 1) % choices.length] }), d).match, false, `${checker}: another option should not match ${JSON.stringify(d)}`);
}
const T = (params: Args): PracticeFigureSpec => ({ type: 'transformer', params });
const I = (params: Args): PracticeFigureSpec => ({ type: 'induction_loop', params });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;
const lab = (value: string): Derived => ({ kind: 'label', value });

test('registration: the part speaks for transformer and induction_loop; six checkers, all reachable through figure-core.ts and listed in the catalogue', () => {
  assert.deepEqual([...PART.kinds], ['transformer', 'induction_loop']);
  assert.deepEqual(Object.keys(PART.checkers).sort(), ['induction_cause', 'induction_current_direction', 'induction_emf', 'induction_flux_change', 'transformer_type', 'transformer_value']);
  for (const k of Object.keys(PART.checkers)) assert.equal(BATCH5_CHECKERS[k], PART.checkers[k], k);
  const cat = checkerCatalogue(['transformer' as never, 'induction_loop' as never]);
  for (const k of Object.keys(PART.checkers)) assert.ok(cat.includes(`- ${k} `), k);
  assert.deepEqual(axesOf(fx('transformer-simple-step-down')), {});
  assert.deepEqual(axesOf(fx('induction-field-simple-entering')), {});
  refused(() => run(fx('transformer-simple-step-down'), 'induction_emf', { want: 'emf' }), /is for induction_loop, not for transformer/);
  refused(() => run(fx('transformer-simple-step-down'), 'transformer_value', { want: 'ratio' }), /"want" must be one of Vs \| Vp/);
});

test('transformer_value: textbook cases — 120 V on 500 : 100 turns; 240 V → 12 V on 1000 turns; 50 : 400 turns at 4 A; 12 V, 5 A stepped up 8 times', () => {
  // Vs/Vp = Ns/Np: 120 V × 100/500 = 24 V.
  const a = fx('transformer-simple-step-down');
  rw(a, 'transformer_value', { want: 'Vs' }, '24', '600');
  rw(a, 'transformer_value', { want: 'turns_ratio' }, '0.2', '5');
  refused(() => run(a, 'transformer_value', { want: 'Is' }), /the primary current is not printed on the figure — pass it as the derivation argument "Ip"/);
  // The question gives the primary current: Is = Ip·Np/Ns = 0.5 × 5 = 2.5 A; power 60 W on both sides.
  rw(a, 'transformer_value', { want: 'Is', Ip: 0.5 }, '2.5', '0.1');
  rw(a, 'transformer_value', { want: 'power_in', Ip: 0.5 }, '60', '12');
  rw(a, 'transformer_value', { want: 'power_out', Ip: 0.5 }, '60', '12');
  // Ns = Np·Vs/Vp = 1000 × 12/240 = 50 turns — the blank is not used, the printed voltages are.
  const b = fx('transformer-blank-secondary-turns');
  rw(b, 'transformer_value', { want: 'Ns' }, '50', '20000');
  rw(b, 'transformer_value', { want: 'turns_ratio' }, '0.05', '20');
  refused(() => run(b, 'transformer_value', { want: 'Np', Vs: 12, Vp: 240 }), /the number of secondary turns is not printed on the figure \(it is the "\?"\) — pass it as the derivation argument "Ns"/);
  // Is/Ip = Np/Ns: 4 A × 50/400 = 0.5 A.
  const c = fx('transformer-blank-current-step-up');
  rw(c, 'transformer_value', { want: 'Is' }, '0.5', '32');
  refused(() => run(c, 'transformer_value', { want: 'Vs' }), /the primary voltage is not printed/);
  rw(c, 'transformer_value', { want: 'Vs', Vp: 15 }, '120', '1.875');
  // All six printed: 12 V × 5 A = 60 W = 96 V × 0.625 A.
  const d = fx('transformer-dense-all-six');
  rw(d, 'transformer_value', { want: 'power_out' }, '60', '480');
  rw(d, 'transformer_value', { want: 'power_in' }, '60', '7.5');
  rw(d, 'transformer_value', { want: 'Vp' }, '12', '768');
  rw(d, 'transformer_value', { want: 'Np' }, '200', '12800');
  rw(d, 'transformer_value', { want: 'Ip' }, '5', '0.078');
  // Counted windings: the loops ARE the turns — 18 V × 3/6 = 9 V, though no turn count is printed.
  rw(fx('transformer-counted-windings'), 'transformer_value', { want: 'Vs' }, '9', '36');
  // A mains adaptor, values only in the question: 230 V to 11.5 V on 2000 primary turns → 100 turns.
  rw(T({ primary: { turns: 2000 }, secondary: { turns: 100 }, show: { Ns: 'blank' }, windings: 'equal' }), 'transformer_value', { want: 'Ns', Vp: 230, Vs: 11.5 }, '100', '40000');
});

test('transformer_value: efficiency below 1 must be passed; a battery on the primary gives nothing on the secondary', () => {
  // 100 V, 2 A in at 90 %: 180 W out; at 20 V that is 9 A.
  const lossy = T({ primary: { voltage: 100, current: 2 }, secondary: { voltage: 20, current: 9 }, efficiency: 0.9, show: { Is: 'blank' } });
  refused(() => run(lossy, 'transformer_value', { want: 'Is' }), /the efficiency is never printed on the figure — pass it as the derivation argument "efficiency"/);
  rw(lossy, 'transformer_value', { want: 'Is', efficiency: 0.9 }, '9', '10');
  rw(lossy, 'transformer_value', { want: 'power_out', efficiency: 0.9 }, '180', '200');
  rw(lossy, 'transformer_value', { want: 'power_in' }, '200', '180');
  refused(() => run(lossy, 'transformer_value', { want: 'Is', efficiency: 1.5 }), /"efficiency" must be greater than 0 and at most 1/);
  const dc = T({ primary: { turns: 100, voltage: 6 }, secondary: { turns: 400 }, source: 'dc' });
  rw(dc, 'transformer_value', { want: 'Vs' }, '0', '24');
  refused(() => run(dc, 'transformer_value', { want: 'turns_ratio' }), /joined to a battery: a steady current induces nothing/);
});

test('transformer_type: from the turns, from the voltages, from the drawn loops; refused when the coils are drawn alike and nothing is printed', () => {
  const opts = ['Step-up', 'Step-down', 'Neither: the voltages are equal', 'It cannot be told'];
  rwMcq(fx('transformer-simple-step-down'), 'transformer_type', {}, opts, 1);
  rwMcq(fx('transformer-dense-all-six'), 'transformer_type', {}, opts, 0);
  rwMcq(fx('transformer-blank-current-step-up'), 'transformer_type', {}, opts, 0);
  // Voltages only (the turns are equal-drawn and one is a blank): 240 V → 12 V is step-down.
  rwMcq(fx('transformer-blank-secondary-turns'), 'transformer_type', {}, opts, 1);
  assert.deepEqual(run(T({ primary: { turns: 80 }, secondary: { turns: 80 } }), 'transformer_type'), lab('neither'));
  // Nothing printed, but the schematic windings show which coil has more turns.
  assert.deepEqual(run(T({ primary: { turns: 50 }, secondary: { turns: 400 }, show: { Np: 'none', Ns: 'none' } }), 'transformer_type'), lab('step-up'));
  const alike = T({ primary: { turns: 50 }, secondary: { turns: 400 }, show: { Np: 'none', Ns: 'blank' }, windings: 'equal' });
  refused(() => run(alike, 'transformer_type'), /the coils are drawn alike and neither both turn counts nor both voltages are printed/);
  assert.deepEqual(run(alike, 'transformer_type', { Vp: 10, Vs: 80 }), lab('step-up'));
  assert.deepEqual(run(fx('transformer-counted-windings'), 'transformer_type'), lab('step-down'));
});

test("induction_current_direction: Lenz's law on the textbook cases — N approaching, N receding, S approaching; a loop entering, leaving and inside a field", () => {
  const seen = ['Clockwise', 'Counterclockwise', 'No current is induced', 'It alternates'];
  // N pole toward the loop: the loop repels it — its near face is a north pole: counter-clockwise seen from the magnet.
  rwMcq(fx('induction-magnet-simple-north-toward'), 'induction_current_direction', {}, seen, 1);
  rwMcq(I({ variant: 'magnet', pole: 'N', motion: 'away' }), 'induction_current_direction', {}, seen, 0);
  rwMcq(fx('induction-magnet-blank-current'), 'induction_current_direction', {}, seen, 0); // S toward
  rwMcq(fx('induction-magnet-dense-coil-meter-current'), 'induction_current_direction', {}, seen, 1); // S away, magnet on the right
  rwMcq(I({ variant: 'magnet', pole: 'N', motion: 'rest' }), 'induction_current_direction', {}, seen, 2);
  // The arrow on the near side as drawn.
  const side = ['Up the page', 'Down the page', 'No current is induced', 'Toward the magnet'];
  rwMcq(fx('induction-magnet-simple-north-toward'), 'induction_current_direction', { view: 'near_side' }, side, 0);
  rwMcq(fx('induction-magnet-blank-current'), 'induction_current_direction', { view: 'near_side' }, side, 1);
  rwMcq(I({ variant: 'magnet', pole: 'N', motion: 'toward', magnetSide: 'right' }), 'induction_current_direction', { view: 'near_side' }, side, 1);
  assert.deepEqual(run(fx('induction-magnet-simple-north-toward'), 'induction_current_direction', { wording: 'anticlockwise' }), lab('anticlockwise'));
  // A loop entering a field into the page: the flux into the page grows, the induced field is out of the page — counter-clockwise.
  rwMcq(fx('induction-field-simple-entering'), 'induction_current_direction', {}, seen, 1);
  rwMcq(I({ variant: 'field', field: 'into', position: 'leaving', direction: 'right' }), 'induction_current_direction', {}, seen, 0);
  rwMcq(fx('induction-field-dense-leaving-values'), 'induction_current_direction', {}, seen, 1); // out of the page, leaving
  rwMcq(fx('induction-field-blank-current-increasing'), 'induction_current_direction', {}, seen, 1);
  rwMcq(fx('induction-field-inside-no-current'), 'induction_current_direction', {}, seen, 2);
  refused(() => run(fx('induction-field-simple-entering'), 'induction_current_direction', { view: 'near_side' }), /"view" is for the magnet variant/);
  refused(() => run(fx('induction-magnet-blank-poles'), 'induction_current_direction'), /the poles of the magnet are blanks on this figure/);
  refused(() => run(fx('induction-field-blank-field-direction'), 'induction_current_direction'), /the direction of the field is a blank on this figure/);
});

test('induction_flux_change: the magnet approaching, receding and at rest; the loop entering, leaving and inside', () => {
  const opts = ['Increasing', 'Decreasing', 'Not changing', 'Reversing'];
  rwMcq(fx('induction-magnet-simple-north-toward'), 'induction_flux_change', {}, opts, 0);
  rwMcq(fx('induction-magnet-blank-poles'), 'induction_flux_change', {}, opts, 1);
  rwMcq(I({ variant: 'magnet', pole: 'S', motion: 'rest' }), 'induction_flux_change', {}, opts, 2);
  rwMcq(fx('induction-field-simple-entering'), 'induction_flux_change', {}, opts, 0);
  rwMcq(fx('induction-field-blank-field-direction'), 'induction_flux_change', {}, opts, 1);
  rwMcq(fx('induction-field-inside-no-current'), 'induction_flux_change', {}, opts, 2);
  rwMcq(I({ variant: 'field', field: 'out', position: 'inside', change: 'decreasing' }), 'induction_flux_change', {}, opts, 1);
});

test('induction_cause: the drawn current read backwards — the facing pole, the field direction', () => {
  // Moving away with the near-side current drawn as for a north pole.
  rwMcq(fx('induction-magnet-blank-poles'), 'induction_cause', {}, ['N (north)', 'S (south)', 'Either', 'Neither'], 0);
  rwMcq(I({ variant: 'magnet', pole: 'S', motion: 'toward', current: 'value', showPoles: 'blank' }), 'induction_cause', {}, ['N (north)', 'S (south)', 'Either', 'Neither'], 1);
  rwMcq(fx('induction-field-blank-field-direction'), 'induction_cause', {}, ['Into the page', 'Out of the page', 'To the left', 'To the right'], 1);
  rwMcq(I({ variant: 'field', field: 'into', position: 'entering', direction: 'right', current: 'value', showField: 'blank' }), 'induction_cause', {}, ['Into the page', 'Out of the page', 'To the left', 'To the right'], 0);
  refused(() => run(fx('induction-magnet-blank-current'), 'induction_cause'), /the induced current is not drawn on this figure/);
  refused(() => run(fx('induction-field-inside-no-current'), 'induction_cause'), /no current is induced in this figure/);
});

test("induction_emf: motional EMF BLv and the current it drives; Faraday's law N·ΔΦ/Δt; nothing when the flux is steady", () => {
  // B = 0.5 T, L = 0.2 m, v = 4 m/s: 0.4 V; through 2 Ω: 0.2 A.
  const d = fx('induction-field-dense-leaving-values');
  rw(d, 'induction_emf', { want: 'emf' }, '0.4', '0.8');
  rw(d, 'induction_emf', { want: 'current' }, '0.2', '0.8');
  // 0.25 T, 0.4 m, 3 m/s (all from the question's text): 0.3 V; through 1.5 Ω: 0.2 A.
  const bare = fx('induction-field-simple-entering');
  refused(() => run(bare, 'induction_emf', { want: 'emf' }), /the field strength is not printed on the figure — pass it as the derivation argument "B"/);
  rw(bare, 'induction_emf', { want: 'emf', B: 0.25, length: 0.4, speed: 3 }, '0.3', '0.03');
  rw(bare, 'induction_emf', { want: 'current', B: 0.25, length: 0.4, speed: 3, resistance: 1.5 }, '0.2', '0.45');
  // 1.2 T, 0.5 m, 10 m/s: 6 V.
  rw(I({ variant: 'field', field: 'into', position: 'entering', direction: 'left', B: 1.2, length: 0.5, speed: 10 }), 'induction_emf', { want: 'emf' }, '6', '0.6');
  // A blank speed is not a value.
  refused(() => run(I({ variant: 'field', field: 'into', position: 'leaving', direction: 'left', B: 1, length: 1, speed: 2, show: { speed: 'blank' } }), 'induction_emf', { want: 'emf' }), /the speed of the loop is not printed on the figure \(it is the "\?"\)/);
  // Wholly inside a steady uniform field: no EMF, no current — whatever the numbers.
  rw(fx('induction-field-inside-no-current'), 'induction_emf', { want: 'emf' }, '0', '0.4');
  rw(fx('induction-field-inside-no-current'), 'induction_emf', { want: 'current' }, '0', '0.2');
  // Faraday: 200 turns (printed), 0.003 Wb in 0.1 s: 6 V. One loop, 0.02 Wb in 0.5 s: 0.04 V. 50 turns passed, 0.01 Wb in 0.25 s: 2 V.
  rw(fx('induction-magnet-dense-coil-meter-current'), 'induction_emf', { want: 'emf', flux_change: 0.003, time: 0.1 }, '6', '0.03');
  rw(fx('induction-magnet-simple-north-toward'), 'induction_emf', { want: 'emf', flux_change: -0.02, time: 0.5 }, '0.04', '0.01');
  rw(fx('induction-magnet-simple-north-toward'), 'induction_emf', { want: 'emf', turns: 50, flux_change: 0.01, time: 0.25 }, '2', '0.04');
  rw(fx('induction-field-blank-current-increasing'), 'induction_emf', { want: 'current', flux_change: 0.006, time: 0.2, resistance: 0.5 }, '0.06', '0.03');
  refused(() => run(fx('induction-magnet-simple-north-toward'), 'induction_emf', { want: 'emf' }), /pass flux_change \(Wb, through one turn\) and time \(s\)/);
  refused(() => run(fx('induction-field-blank-current-increasing'), 'induction_emf', { want: 'emf' }), /a loop at rest in a changing field needs the rate/);
  refused(() => run(I({ variant: 'magnet', pole: 'N', motion: 'rest' }), 'induction_emf', { want: 'emf', flux_change: 1, time: 1 }), /the flux through the loop is not changing/);
});

test('transcriptions: exactly what is printed; a blank is a blank and its value appears nowhere', () => {
  const t1 = textOf(fx('transformer-simple-step-down'));
  assert.ok(t1.includes('The figure is a diagram of a transformer.'));
  assert.ok(t1.includes('- primary turns: "N₁ = 500 turns"') && t1.includes('- secondary turns: "N₂ = 100 turns"') && t1.includes('- primary voltage: "V₁ = 120 V"'));
  assert.ok(t1.includes('joined to an AC source') && t1.includes('joined to a resistor') && t1.includes('the coil "Primary" is drawn with more loops than the other'));
  assert.ok(!/\b24\b/.test(t1) && !/step-down/.test(t1), 'neither the secondary voltage nor the kind is named');
  const t2 = textOf(fx('transformer-blank-secondary-turns'));
  assert.ok(t2.includes('- secondary turns: "N₂ =" (blank — a "?" box)') && !/\b50\b/.test(t2) && t2.includes('both coils are drawn with the same number of loops') && t2.includes('joined to a lamp'));
  const t3 = textOf(fx('transformer-counted-windings'));
  assert.ok(t3.includes('every turn is drawn: the coil "Primary" has 6 loops and the coil "Secondary" has 3') && t3.includes('joined to two open terminals'));
  const t4 = textOf(fx('induction-magnet-simple-north-toward'));
  assert.ok(t4.includes('The figure is a sketch of a bar magnet and a loop of wire.'));
  assert.ok(t4.includes('the end of the magnet that faces the loop is marked "N"') && t4.includes('points toward the loop') && !/clockwise|induced current/.test(t4));
  const t5 = textOf(fx('induction-magnet-blank-current'));
  assert.ok(t5.includes('- induced current: (blank — a "?" box)') && !/\b(up|down) the page/.test(t5) && !/clockwise/.test(t5));
  const t6 = textOf(fx('induction-magnet-blank-poles'));
  assert.ok(t6.includes('both ends of the magnet are blanks') && t6.includes('points down the page') && !/"N"|"S"/.test(t6));
  const t7 = textOf(fx('induction-magnet-dense-coil-meter-current'));
  assert.ok(t7.includes('- turns: "N = 200 turns"') && t7.includes('- meter: "G"') && t7.includes('to the right of it') && t7.includes('- arrow label: "v = 0.5 m/s"'));
  const t8 = textOf(fx('induction-field-dense-leaving-values'));
  assert.ok(t8.includes('The figure is a sketch of a loop of wire and a region of magnetic field.'));
  assert.ok(t8.includes('dots (•)') && t8.includes('across its right edge') && t8.includes('out of the region'));
  for (const s of ['- field strength: "B = 0.5 T"', '- side length: "L = 0.2 m"', '- speed: "v = 4 m/s"', '- resistance: "R = 2 Ω"', '- current label: "I"']) assert.ok(t8.includes(s), s);
  assert.ok(!/0\.4 V|0\.2 A|clockwise/.test(t8), 'neither the EMF, the current nor a direction word');
  const t9 = textOf(fx('induction-field-blank-field-direction'));
  assert.ok(t9.includes('it is drawn empty') && t9.includes('- speed: "v =" (blank — a "?" box)') && !/crosses|dots|into the page|out of the page/.test(t9));
  const t10 = textOf(fx('induction-field-blank-current-increasing'));
  assert.ok(t10.includes('- caption: "B increasing"') && t10.includes('the loop is at rest') && t10.includes('- induced current: (blank — a "?" box)'));
});

test('describeForAlt over every em fixture: only text the figure prints, blanks counted not named', () => {
  for (const f of FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600, `${f.id}: ${alt.length}`);
    assert.ok(!/\d/.test(alt.replace(/"[^"]*"/g, '')), `${f.id}: a digit outside a quoted label — ${alt}`);
    assert.ok(!/clockwise|step-up|step-down/.test(alt), `${f.id}: an answer word — ${alt}`);
    if (/blank/.test(f.id)) assert.ok(/left blank, shown as a boxed question mark/.test(alt), `${f.id}: ${alt}`);
  }
  const alt = describeForAlt(fx('transformer-blank-secondary-turns'));
  assert.ok(/^A diagram of a transformer\./.test(alt) && !/\b50\b/.test(alt) && alt.includes('"N₁ = 1000 turns"'), alt);
  assert.ok(/One place is left blank/.test(alt), alt);
  assert.ok(/Two places are left blank/.test(describeForAlt(fx('induction-magnet-blank-poles'))));
  // A value the author wants out of the alt can be hidden.
  assert.ok(!describeForAlt(fx('transformer-simple-step-down'), { hide: ['120 V'] }).includes('120'));
  assert.ok(!describeForAlt(fx('induction-field-dense-leaving-values'), { hide: [0.5] }).includes('0.5'));
});

test('examineFigureItem: a right key is derived, a wrong key is a mismatch, a blank needed by the checker is an error', () => {
  const spec = fx('transformer-simple-step-down');
  const stem = 'The ideal transformer in the figure is connected to the AC supply shown. What is the voltage across its secondary coil, in volts?';
  const ok = examineFigureItem(item(spec, { problemText: stem, answer: '24', alt: describeForAlt(spec), derivation: { checker: 'transformer_value', args: { want: 'Vs' } } }));
  assert.deepEqual(ok.defects, []);
  assert.equal(ok.derivation.status, 'derived');
  const bad = examineFigureItem(item(spec, { problemText: stem, answer: '600', alt: describeForAlt(spec), derivation: { checker: 'transformer_value', args: { want: 'Vs' } } }));
  assert.equal(bad.derivation.status, 'mismatch');
  const loop = fx('induction-field-simple-entering');
  const dir = examineFigureItem(item(loop, {
    responseFormat: 'mcq', choices: ['Clockwise', 'Counterclockwise', 'No current is induced', 'It alternates'], answer: 'B',
    problemText: 'The loop in the figure moves to the right into the region of magnetic field shown. In which direction does the induced current flow round the loop?',
    alt: describeForAlt(loop), derivation: { checker: 'induction_current_direction', args: {} },
    distractorRationales: ['Reverses Lenz’s law.', 'Forgets that the flux is changing.', 'The flux changes steadily in one sense.'],
  }));
  assert.deepEqual(dir.defects, []);
  assert.equal(dir.derivation.status, 'derived');
  const blank = fx('induction-magnet-blank-poles');
  const err = examineFigureItem(item(blank, { problemText: 'In which direction does the induced current flow in the loop in the figure, as seen from the magnet?', answer: 'clockwise', alt: describeForAlt(blank), derivation: { checker: 'induction_current_direction', args: {} } }));
  assert.equal(err.derivation.status, 'error');
  assert.ok(/poles of the magnet are blanks/.test(err.derivation.detail));
});

test('every checker of the part was exercised', () => {
  for (const k of Object.keys(PART.checkers)) assert.ok(used.has(k), k);
});

console.log(`${passed} figure-core-batch5-em test(s) passed`);
