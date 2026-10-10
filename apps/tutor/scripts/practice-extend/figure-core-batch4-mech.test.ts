/**
 * Tests for scripts/practice-extend/figure-core-batch4-mech.ts (mechanics_setup),
 * reached the way the job reaches it — through figure-core.ts (`describeFigure`,
 * `describeForAlt`, `runChecker`, `compareDerived`, `examineFigureItem`,
 * `checkerCatalogue`, `axesOf`).
 *
 * Per checker: right keys accepted and wrong keys rejected, on textbook-standard
 * cases with known answers (three or more per checker); refusals when a value
 * is neither printed nor passed. Per variant: the transcription says what is
 * printed, keeps a blank blank and never names what a question asks for.
 *
 * Pure — no network, no model, no database.
 * Run from apps/tutor:  npx tsx scripts/practice-extend/figure-core-batch4-mech.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PracticeFigureSpec } from '../../src/lib/tutor/practice-figure/render';
import { FIXTURES } from '../lib/practice-figure-fixtures-b4-mech';
import { BATCH4_CHECKERS, FigureRuleError, axesOf, checkerCatalogue, compareDerived, describeFigure, describeForAlt, examineFigureItem, runChecker, type Derived, type FigureItem } from './figure-core';
import { PART } from './figure-core-batch4-mech';

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
const M = (params: Args): PracticeFigureSpec => ({ type: 'mechanics_setup', params });
const fx = (id: string): PracticeFigureSpec => (FIXTURES.find((f) => f.id === id) ?? assert.fail(`no fixture ${id}`)).spec;
const textOf = (spec: PracticeFigureSpec): string => describeFigure(spec).text;

test('registration: the part speaks for mechanics_setup; six checkers, all reachable through figure-core.ts and listed in the catalogue', () => {
  assert.deepEqual([...PART.kinds], ['mechanics_setup']);
  assert.deepEqual(Object.keys(PART.checkers).sort(), ['circular_value', 'collision_value', 'pendulum_value', 'projectile_value', 'pulley_value', 'spring_value']);
  for (const k of Object.keys(PART.checkers)) assert.equal(BATCH4_CHECKERS[k], PART.checkers[k], k);
  const cat = checkerCatalogue(['mechanics_setup' as never]);
  for (const k of Object.keys(PART.checkers)) assert.ok(cat.includes(`- ${k} `), k);
  assert.ok(/default 9\.8/.test(cat), 'the catalogue says what g is');
  assert.deepEqual(axesOf(fx('mech-projectile-angled')), {});
  refused(() => run(fx('mech-pulley-atwood'), 'projectile_value', { want: 'range' }), /for the projectile variant of mechanics_setup, not pulley/);
  refused(() => run({ type: 'bar_chart', params: { categories: ['a'], values: [1] } }, 'spring_value', { want: 'force' }), /is for mechanics_setup, not for bar_chart/);
  refused(() => run(fx('mech-projectile-angled'), 'projectile_value', { want: 'speed' }), /"want" must be one of time_of_flight/);
});

test('projectile_value: textbook flights — 20 m/s at 30°, a level launch from 1.225 m, 25 m/s at 53.13° from 25 m (g = 10), 30 m/s at 60° (g = 10)', () => {
  const a = fx('mech-projectile-angled');
  rw(a, 'projectile_value', { want: 'time_of_flight' }, '2.04', '4.08');
  rw(a, 'projectile_value', { want: 'range' }, '35.3', '40.8');
  rw(a, 'projectile_value', { want: 'max_height' }, '5.1', '20.4');
  rw(a, 'projectile_value', { want: 'vx' }, '17.3', '10');
  rw(a, 'projectile_value', { want: 'vy_launch' }, '10', '17.3');
  rw(a, 'projectile_value', { want: 'time_to_apex' }, '1.02', '2.04');
  rw(a, 'projectile_value', { want: 'impact_speed' }, '20', '10');
  rw(a, 'projectile_value', { want: 'vy_impact' }, '-10', '10');
  const table = fx('mech-projectile-blank-range-table');
  rw(table, 'projectile_value', { want: 'time_of_flight' }, '0.5', '0.25');
  rw(table, 'projectile_value', { want: 'range' }, '1.5', '3.675');
  rw(table, 'projectile_value', { want: 'impact_speed' }, '5.75', '4.9');
  const cliff = fx('mech-projectile-cliff-dense');
  rw(cliff, 'projectile_value', { want: 'time_of_flight' }, '5.0', '4.0');
  rw(cliff, 'projectile_value', { want: 'range' }, '75.0', '100');
  rw(cliff, 'projectile_value', { want: 'max_height' }, '45.0', '20');
  const steep = fx('mech-projectile-blank-max-height');
  rw(steep, 'projectile_value', { want: 'max_height' }, '33.75', '45');
  rw(steep, 'projectile_value', { want: 'time_of_flight' }, '5.2', '3');
  // g is the spec's unless the argument overrides it.
  rw(a, 'projectile_value', { want: 'time_of_flight', g: 10 }, '2', '2.04');
});

test('projectile_value refuses a value that is neither printed nor passed; a level launch and the ground need no number', () => {
  const hidden = M({ variant: 'projectile', speed: 20, angle: 30, show: { speed: 'blank' } });
  refused(() => run(hidden, 'projectile_value', { want: 'range' }), /the speed is not printed on the figure \(it is the "\?"\) — pass it as the derivation argument "speed"/);
  rw(hidden, 'projectile_value', { want: 'range', speed: 20 }, '35.3', '17.7');
  const noAngle = M({ variant: 'projectile', speed: 20, angle: 30, show: { angle: 'none' } });
  refused(() => run(noAngle, 'projectile_value', { want: 'range' }), /the angle is not printed/);
  const noHeight = M({ variant: 'projectile', speed: 3, angle: 0, height: 1.225, show: { height: 'none' } });
  refused(() => run(noHeight, 'projectile_value', { want: 'range' }), /the launch height is not printed/);
  rw(noHeight, 'projectile_value', { want: 'range', height: 1.225 }, '1.5', '3');
});

test('pulley_value: Atwood 3 kg / 5 kg, a frictionless table 6 kg / 2 kg, a rough table 5 kg / 3 kg (μ = 0.2), a rough incline 4 kg / 6 kg at 30° (μ = 0.2)', () => {
  const atwood = fx('mech-pulley-atwood');
  rw(atwood, 'pulley_value', { want: 'acceleration' }, '2.45', '9.8');
  rw(atwood, 'pulley_value', { want: 'tension' }, '36.75', '39.2');
  rw(M({ variant: 'pulley', arrangement: 'atwood', m1: 2, m2: 2.5 }), 'pulley_value', { want: 'acceleration', g: 10 }, '1.11', '5');
  const table = M({ variant: 'pulley', arrangement: 'table', m1: 6, m2: 2, frictionless: true });
  rw(table, 'pulley_value', { want: 'acceleration' }, '2.45', '3.27');
  rw(table, 'pulley_value', { want: 'tension' }, '14.7', '19.6');
  const rough = M({ variant: 'pulley', arrangement: 'table', m1: 5, m2: 3, mu: 0.2 });
  rw(rough, 'pulley_value', { want: 'acceleration' }, '2.45', '3.675');
  rw(rough, 'pulley_value', { want: 'tension' }, '22.05', '29.4');
  const incline = fx('mech-pulley-incline-dense');
  rw(incline, 'pulley_value', { want: 'acceleration' }, '3.24', '3.92');
  rw(incline, 'pulley_value', { want: 'tension' }, '39.4', '58.8');
  // The block slides DOWN a frictionless 30° incline when the hanging block is light: a = (m1 g sin θ − m2 g)/(m1 + m2).
  const down = M({ variant: 'pulley', arrangement: 'incline', m1: 10, m2: 2, angle: 30, frictionless: true });
  rw(down, 'pulley_value', { want: 'acceleration' }, '2.45', '4.9');
  rw(down, 'pulley_value', { want: 'tension' }, '24.5', '14.7');
});

test('pulley_value refuses a blank mass, an unstated surface and a system friction holds still', () => {
  const blank = fx('mech-pulley-table-blank-mass');
  refused(() => run(blank, 'pulley_value', { want: 'acceleration' }), /the second mass is not printed on the figure \(it is the "\?"\) — pass it as the derivation argument "m2"/);
  rw(blank, 'pulley_value', { want: 'acceleration', m2: 2 }, '2.45', '9.8');
  refused(() => run(M({ variant: 'pulley', arrangement: 'table', m1: 5, m2: 3 }), 'pulley_value', { want: 'acceleration' }), /does not say whether the surface has friction — pass the derivation argument "mu"/);
  refused(() => run(M({ variant: 'pulley', arrangement: 'table', m1: 10, m2: 1, mu: 0.5 }), 'pulley_value', { want: 'acceleration' }), /friction holds the blocks at rest/);
  refused(() => run(M({ variant: 'pulley', arrangement: 'atwood', m1: 2, m2: 2 }), 'pulley_value', { want: 'tension', g: 0 }), /"g" must be greater than 0/);
});

test("spring_value: Hooke's law, elastic energy and period on standard cases", () => {
  const h = fx('mech-spring-horizontal'); // k = 200 N/m, x = 0.15 m
  rw(h, 'spring_value', { want: 'force' }, '30', '15');
  rw(h, 'spring_value', { want: 'elastic_pe' }, '2.25', '4.5');
  const v = fx('mech-spring-vertical-dense'); // k = 80 N/m, m = 0.5 kg, x = 0.04 m
  rw(v, 'spring_value', { want: 'period' }, '0.497', '0.079');
  rw(v, 'spring_value', { want: 'frequency' }, '2.01', '12.6');
  rw(v, 'spring_value', { want: 'force' }, '3.2', '32');
  rw(v, 'spring_value', { want: 'max_speed' }, '0.506', '6.4');
  const c = fx('mech-spring-blank-compressed'); // k = 800 N/m, x is the "?" (0.1 m)
  refused(() => run(c, 'spring_value', { want: 'elastic_pe' }), /the displacement from equilibrium is not printed on the figure \(it is the "\?"\)/);
  rw(c, 'spring_value', { want: 'elastic_pe', x: 0.1 }, '4', '40');
  rw(c, 'spring_value', { want: 'force', x: 0.1 }, '80', '8');
  rw(c, 'spring_value', { want: 'period' }, '0.314', '3.14');
  // Nothing printed, everything passed: T = 2π√(1/100) for 1 kg on 100 N/m.
  rw(M({ variant: 'spring_mass' }), 'spring_value', { want: 'period', k: 100, m: 1 }, '0.628', '6.28');
  refused(() => run(M({ variant: 'spring_mass', k: 100 }), 'spring_value', { want: 'period' }), /the mass is not printed/);
});

test('pendulum_value: period of a 0.99 m pendulum, rise height and bottom speed at 50° and 60°', () => {
  rw(fx('mech-pendulum-length'), 'pendulum_value', { want: 'period' }, '2.0', '1.0');
  rw(fx('mech-pendulum-length'), 'pendulum_value', { want: 'frequency' }, '0.50', '2.0');
  const d = fx('mech-pendulum-dense-points'); // L = 2 m, 50°
  rw(d, 'pendulum_value', { want: 'rise_height' }, '0.714', '1.29');
  rw(d, 'pendulum_value', { want: 'bottom_speed' }, '3.74', '6.26');
  rw(d, 'pendulum_value', { want: 'period' }, '2.84', '1.42');
  const b = fx('mech-pendulum-blank-height'); // L = 1.2 m, 60° → h = 0.6 m exactly
  rw(b, 'pendulum_value', { want: 'rise_height' }, '0.6', '1.04');
  rw(b, 'pendulum_value', { want: 'bottom_speed' }, '3.43', '4.85');
  rw(b, 'pendulum_value', { want: 'bottom_speed', g: 10 }, '3.46', '3.43');
  const bare = M({ variant: 'pendulum', angle: 30 });
  refused(() => run(bare, 'pendulum_value', { want: 'period' }), /the string length is not printed on the figure — pass it as the derivation argument "length"/);
  rw(bare, 'pendulum_value', { want: 'period', length: 0.25 }, '1.00', '0.50');
  refused(() => run(M({ variant: 'pendulum', angle: 30, length: 1, show: { angle: 'blank' } }), 'pendulum_value', { want: 'rise_height' }), /the angle is not printed/);
});

test('collision_value: momentum, kinetic energy and the kind of collision on standard cases', () => {
  const a = fx('mech-collision-head-on'); // 2 kg, 2 kg: 4, 0 → 1, 3
  rw(a, 'collision_value', { want: 'total_momentum' }, '8', '6');
  rw(a, 'collision_value', { want: 'ke_before' }, '16', '8');
  rw(a, 'collision_value', { want: 'ke_after' }, '10', '16');
  rw(a, 'collision_value', { want: 'ke_lost' }, '6', '0');
  rw(a, 'collision_value', { want: 'final_velocity', cart: 1 }, '3', '4');
  rw(a, 'collision_value', { want: 'final_velocity', cart: 0 }, '1', '3');
  assert.deepEqual(run(a, 'collision_value', { want: 'type' }), { kind: 'label', value: 'inelastic' });
  const o = fx('mech-collision-dense-opposite'); // 3 kg, 1.5 kg: 2, −4 → −1, 2
  rw(o, 'collision_value', { want: 'total_momentum' }, '0', '12');
  rw(o, 'collision_value', { want: 'ke_lost' }, '13.5', '4.5');
  rw(o, 'collision_value', { want: 'final_velocity', cart: 0 }, '-1', '1');
  const elastic = M({ variant: 'collision', masses: [2, 2], before: [4, 0], after: [0, 4] });
  assert.deepEqual(run(elastic, 'collision_value', { want: 'type' }), { kind: 'label', value: 'elastic' });
  rw(elastic, 'collision_value', { want: 'ke_lost' }, '0', '16');
  // 1 kg at 3 m/s into 2 kg at rest, elastic: −1 and 2.
  const unequal = M({ variant: 'collision', masses: [1, 2], before: [3, 0], after: [-1, 2] });
  assert.deepEqual(run(unequal, 'collision_value', { want: 'type' }), { kind: 'label', value: 'elastic' });
  rw(unequal, 'collision_value', { want: 'final_velocity', cart: 1 }, '2', '3');
  const stick = fx('mech-collision-blank-stick'); // 1.5 kg at 6 m/s into 0.5 kg at rest → 4.5 m/s
  rw(stick, 'collision_value', { want: 'final_velocity' }, '4.5', '6');
  rw(stick, 'collision_value', { want: 'total_momentum' }, '9', '4.5');
  assert.deepEqual(run(stick, 'collision_value', { want: 'type' }), { kind: 'label', value: 'perfectly inelastic' });
  refused(() => run(stick, 'collision_value', { want: 'ke_lost' }), /velocity after is not printed on the figure \(it is the "\?"\)/);
  rw(stick, 'collision_value', { want: 'ke_lost', v1: 4.5 }, '6.75', '27');
  // An explosion: a 3 kg and a 1 kg cart at rest spring apart.
  const explosion = M({ variant: 'collision', masses: [3, 1], before: [0, 0], after: [-2, 6], explosion: true, show: { v2: 'blank' } });
  rw(explosion, 'collision_value', { want: 'final_velocity', cart: 1 }, '6', '-6');
  refused(() => run(explosion, 'collision_value', { want: 'final_velocity', cart: 0 }), /second cart's velocity after is not printed/);
});

test('circular_value: v²/r, m·v²/r, the period, and the speed from a given force', () => {
  const ball = fx('mech-circular-ball'); // r = 0.8 m, v = 4 m/s
  rw(ball, 'circular_value', { want: 'acceleration' }, '20', '5');
  rw(ball, 'circular_value', { want: 'period' }, '1.26', '0.8');
  rw(ball, 'circular_value', { want: 'angular_speed' }, '5', '3.2');
  refused(() => run(ball, 'circular_value', { want: 'force' }), /the mass is not printed on the figure — pass it as the derivation argument "mass"/);
  rw(ball, 'circular_value', { want: 'force', mass: 0.5 }, '10', '2.5');
  const puck = fx('mech-circular-blank-speed'); // m = 2 kg, r = 0.5 m, the speed is the "?"
  refused(() => run(puck, 'circular_value', { want: 'acceleration' }), /the speed is not printed on the figure \(it is the "\?"\)/);
  rw(puck, 'circular_value', { want: 'speed', force: 36 }, '3', '9');
  refused(() => run(puck, 'circular_value', { want: 'speed' }), /"force" .* is needed to find the speed/);
  // A 1200 kg car at 15 m/s round a 50 m bend: 5400 N.
  const car = M({ variant: 'circular', radius: 50, speed: 15, mass: 1200, arrows: ['velocity'] });
  rw(car, 'circular_value', { want: 'force' }, '5400', '360');
  rw(car, 'circular_value', { want: 'acceleration' }, '4.5', '0.3');
  // In the figure's own units: 7000 km and 7.5 km/s give a period in seconds.
  rw(fx('mech-circular-dense-orbit'), 'circular_value', { want: 'period' }, '5864.3', '933');
});

test('transcriptions: exactly what is printed; a blank is a blank and its value appears nowhere', () => {
  const t1 = textOf(fx('mech-projectile-blank-range-table'));
  assert.ok(t1.includes('The figure is a sketch of a projectile and the path it follows.'));
  assert.ok(t1.includes('- launch speed: "v₀ = 3 m/s"') && t1.includes('- launch height: "1.225 m"') && t1.includes('- horizontal distance: (blank — a "?" box)'));
  assert.ok(!/1\.5\b/.test(t1) && !/0\.5 s/.test(t1), 'neither the range nor the time is named');
  assert.ok(t1.includes('launched from the edge of a table, horizontally'));
  const t2 = textOf(fx('mech-projectile-cliff-dense'));
  assert.ok(t2.includes('the point "P" is at the highest point of the path') && t2.includes('the point "Q" is on the falling part of the path') && t2.includes('the point "R" is where the path meets the ground'));
  assert.ok(!/3 s/.test(t2), 'a point is placed, not timed');
  const t3 = textOf(fx('mech-pulley-table-blank-mass'));
  assert.ok(t3.includes('- mass: "6 kg"') && t3.includes('- mass: (blank — a "?" box)') && t3.includes('"frictionless"') && !t3.includes('"2 kg"'));
  const t4 = textOf(fx('mech-spring-blank-compressed'));
  assert.ok(t4.includes('compressed short of') && t4.includes('- displacement: (blank — a "?" box)') && !t4.includes('0.1'));
  const t5 = textOf(fx('mech-pendulum-blank-height'));
  assert.ok(t5.includes('- height: "h =" (blank — a "?" box)') && !t5.includes('0.6'));
  const t6 = textOf(fx('mech-collision-blank-stick'));
  assert.ok(t6.includes('After — the two carts are joined and move as one: its velocity is a blank') && !t6.includes('4.5'));
  assert.ok(t6.includes('cart "A": an arrow pointing right labelled "6 m/s"; cart "B": marked "at rest"'));
  const t7 = textOf(fx('mech-collision-dense-opposite'));
  assert.ok(t7.includes('cart "Y": an arrow pointing left labelled "4 m/s"') && !t7.includes('−4'), 'a speed and a direction, as drawn');
  const t8 = textOf(fx('mech-circular-blank-speed'));
  assert.ok(t8.includes('- speed: "v =" (blank — a "?" box)') && t8.includes('a dashed arrow from the object toward the centre of the circle is labelled "a"'));
  // Hidden outright: not mentioned at all.
  const hidden = textOf(M({ variant: 'pulley', arrangement: 'incline', m1: 4, m2: 6, angle: 30, mu: 0.2, show: { angle: 'none', mu: 'none', m1: 'none' } }));
  assert.ok(!/30|0\.2|4 kg/.test(hidden) && hidden.includes('"6 kg"'));
});

test('describeForAlt over every mech fixture: only text the figure prints, blanks counted not named', () => {
  for (const f of FIXTURES) {
    const alt = describeForAlt(f.spec);
    assert.ok(alt.length >= 12 && alt.length <= 600, `${f.id}: ${alt.length}`);
    assert.ok(!/\d/.test(alt.replace(/"[^"]*"/g, '')), `${f.id}: a digit outside a quoted label — ${alt}`);
    if (/blank/.test(f.id)) assert.ok(/left blank, shown as a boxed question mark/.test(alt), `${f.id}: ${alt}`);
  }
  const alt = describeForAlt(fx('mech-collision-blank-stick'));
  assert.ok(!alt.includes('4.5'));
  assert.ok(/^A before-and-after sketch of two carts colliding on a track\./.test(alt), alt);
  // A value the author wants out of the alt can be hidden.
  assert.ok(!describeForAlt(fx('mech-pulley-atwood'), { hide: ['3 kg'] }).includes('3 kg'));
});

test('examineFigureItem: a right key is derived, a wrong key is a mismatch, a blank needed by the checker is an error', () => {
  const spec = fx('mech-projectile-blank-range-table');
  const stem = 'A marble leaves the table as shown in the figure. How far from the foot of the table does it land, in metres?';
  const ok = examineFigureItem(item(spec, { problemText: stem, answer: '1.5', alt: describeForAlt(spec), derivation: { checker: 'projectile_value', args: { want: 'range' } } }));
  assert.deepEqual(ok.defects, []);
  assert.equal(ok.derivation.status, 'derived');
  const bad = examineFigureItem(item(spec, { problemText: stem, answer: '3', alt: describeForAlt(spec), derivation: { checker: 'projectile_value', args: { want: 'range' } } }));
  assert.equal(bad.derivation.status, 'mismatch');
  const blank = fx('mech-pulley-table-blank-mass');
  const err = examineFigureItem(item(blank, { problemText: 'What is the acceleration of the blocks in the figure?', answer: '2.45', alt: describeForAlt(blank), derivation: { checker: 'pulley_value', args: { want: 'acceleration' } } }));
  assert.equal(err.derivation.status, 'error');
  assert.ok(/second mass is not printed/.test(err.derivation.detail));
});

test('not to scale (fix f, batch 5): the transcription says so, the checkers still work from the TRUE numbers, a blank angle stays unnamed', () => {
  const S = (params: Record<string, unknown>): PracticeFigureSpec => ({ type: 'mechanics_setup', params });
  const pend = S({ variant: 'pendulum', angle: 60, length: 2, notToScale: true, show: { angle: 'blank', height: 'value' } });
  const d = describeFigure(pend);
  assert.ok(d.text.includes('"not to scale"') && d.printed.includes('note: "not to scale"'));
  assert.ok(!/60/.test(d.text) && !/60/.test(describeForAlt(pend)), 'the hidden angle is nowhere');
  assert.ok(describeForAlt(pend).includes('not to scale'));
  // h = L(1 − cos θ): 2 m at 60° rises 1 m — the angle is passed (the question states it), the length is printed.
  rw(pend, 'pendulum_value', { want: 'rise_height', angle: 60 }, '1', '0.36');
  refused(() => run(pend, 'pendulum_value', { want: 'rise_height' }), /angle/);
  const proj = S({ variant: 'projectile', speed: 28, angle: 20, notToScale: true, show: { range: 'value' } });
  assert.ok(!describeFigure(proj).text.includes('drawn to scale') && describeFigure(proj).text.includes('not to scale'));
  assert.ok(describeFigure(S({ variant: 'projectile', speed: 28, angle: 20 })).text.includes('the path is drawn to scale'));
  rw(proj, 'projectile_value', { want: 'range' }, '51.4', '80');
  const inc = S({ variant: 'pulley', arrangement: 'incline', m1: 5, m2: 5, angle: 30, frictionless: true, notToScale: true });
  rw(inc, 'pulley_value', { want: 'acceleration' }, '2.45', '4.9');
  assert.ok(describeFigure(inc).text.includes('not to scale'));
});

test('every checker of the part was exercised', () => {
  for (const k of Object.keys(PART.checkers)) assert.ok(used.has(k), k);
});

console.log(`${passed} figure-core-batch4-mech test(s) passed`);
