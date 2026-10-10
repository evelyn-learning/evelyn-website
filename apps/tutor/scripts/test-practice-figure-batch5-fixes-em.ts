/**
 * Practice-figure renderer — batch 5, part "fixes-em": fix f — the
 * `notToScale` option of mechanics_setup (kinds/mechanics.ts). An angle-bearing
 * set-up (projectile, pendulum, pulley on an incline) is drawn at ONE fixed
 * shape whatever its numbers are, and "not to scale" is printed under it, so
 * an asked-for angle or height cannot be measured off the sketch.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch5-fixes-em.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { SCHEMATIC_ANGLES, mechanicsModel } from '../src/lib/tutor/practice-figure/kinds/mechanics';
import { FIXTURES } from './lib/practice-figure-fixtures-b5-fixes-em';
import { fixtureInvariants, has, makeRunner, near, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const K = 'mechanics_setup';
const svg = (p: Params): string => svgOf(K, p);
/** The picture with every <text> removed: the geometry alone. */
const geometry = (s: string): string => s.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, '');

console.log('\nEvery fix-f fixture:\n');
fixtureInvariants(test, FIXTURES, {}, ['f'], 'fix5');

console.log('\nfix f — notToScale:\n');

test('the option is opt-in: without it (or with false) a set-up is the very bytes it was, and prints no "not to scale"', () => {
  for (const p of [{ variant: 'pendulum', angle: 25, length: 1.2 }, { variant: 'projectile', speed: 20, angle: 30 }, { variant: 'pulley', arrangement: 'incline', m1: 4, m2: 6, angle: 30 }] as Params[]) {
    assert.equal(svg({ ...p, notToScale: false }), svg(p));
    assert.ok(!has(svg(p), 'not to scale'));
    assert.ok(has(svg({ ...p, notToScale: true }), 'not to scale'));
    assert.equal(mechanicsModel(reader(K, p)).notToScale, undefined);
    assert.equal(mechanicsModel(reader(K, { ...p, notToScale: true })).notToScale, true);
  }
});

test('pendulum: the GEOMETRY is the same for every angle (20°, 45°, 70°) — only the printed values differ; the true angle draws differently', () => {
  const at = (angle: number, extra: Params = {}): string => svg({ variant: 'pendulum', angle, length: 2, notToScale: true, show: { height: 'blank' }, ...extra });
  assert.equal(geometry(at(20)), geometry(at(45)));
  assert.equal(geometry(at(45)), geometry(at(70)));
  assert.ok(has(at(20), '20°') && has(at(70), '70°'));
  assert.notEqual(geometry(svg({ variant: 'pendulum', angle: 20, length: 2 })), geometry(svg({ variant: 'pendulum', angle: 70, length: 2 })));
  // The drawn string makes the fixed angle with the vertical.
  const s = at(70, { show: {} });
  const m = /<path d="M([\d.]+),([\d.]+)L([\d.]+),([\d.]+)" fill="none" stroke="#111827" stroke-width="1.6"\/>/.exec(s) as RegExpExecArray;
  near((Math.atan2(Number(m[3]) - Number(m[1]), Number(m[4]) - Number(m[2])) * 180) / Math.PI, SCHEMATIC_ANGLES.pendulum, 0.05);
  // A blank angle stays a blank; the model still holds the true angle for the checkers.
  const f = FIXTURES.find((x) => x.id === 'fix5-f-pendulum-blank-angle-not-to-scale')!;
  assert.ok(texts(svg(f.spec.params)).includes('?') && !texts(svg(f.spec.params)).some((t) => /60/.test(t)));
  assert.equal(mechanicsModel(reader(K, f.spec.params)).pendulum!.angle, 60);
});

test('pendulum: lettered positions keep their side and their order on the fixed swing', () => {
  const s = svg({ variant: 'pendulum', angle: 10, notToScale: true, points: [{ angle: -10, label: 'P' }, { angle: 0, label: 'Q' }, { angle: 5, label: 'R' }, { angle: 10, label: 'S' }] });
  const xs = ['P', 'Q', 'R', 'S'].map((l) => Number(new RegExp(`<text x="([\\d.]+)"[^>]*>${l}</text>`).exec(s)![1]));
  assert.ok(xs[0] < xs[1] && xs[1] < xs[2] && xs[2] < xs[3], String(xs));
});

test('projectile: one fixed path for every angled launch from the ground, one for a launch from a height, one for a level launch', () => {
  const g = (p: Params): string => geometry(svg({ variant: 'projectile', notToScale: true, show: { speed: 'none', angle: 'none', height: 'none' }, ...p }));
  assert.equal(g({ speed: 28, angle: 20 }), g({ speed: 12, angle: 70 }));
  assert.equal(g({ speed: 28, angle: 20, height: 5 }), g({ speed: 9, angle: 60, height: 80 }));
  assert.equal(g({ speed: 3, angle: 0, height: 1 }), g({ speed: 30, angle: 0, height: 2 }));
  assert.notEqual(g({ speed: 28, angle: 20 }), g({ speed: 28, angle: 20, height: 5 }));
  // Apex and landing points are still at the apex and the landing of the drawn path; printed values are the true ones.
  const s = svg({ variant: 'projectile', speed: 28, angle: 20, notToScale: true, show: { range: 'value', maxHeight: 'value' }, points: [{ at: 'apex', label: 'P' }, { at: 1, label: 'Q' }, { at: 'landing', label: 'R' }] });
  assert.ok(has(s, '20°') && has(s, '51.4 m') && has(s, '4.68 m') && has(s, 'not to scale'));
  assert.deepEqual(warn(K, { variant: 'projectile', speed: 28, angle: 4, notToScale: true }), [], 'a 4° launch is no longer a sliver');
  assert.ok(warn(K, { variant: 'projectile', speed: 28, angle: 4 }).length > 0);
});

test('incline: the wedge is the same for 15° and 55°', () => {
  const g = (angle: number): string => geometry(svg({ variant: 'pulley', arrangement: 'incline', m1: 2, m2: 3, angle, notToScale: true }));
  assert.equal(g(15), g(55));
  assert.ok(has(svg({ variant: 'pulley', arrangement: 'incline', m1: 2, m2: 3, angle: 55, notToScale: true }), '55°'));
});

test('refusals: only the set-ups drawn at an angle take it; it must be true or false', () => {
  const re = /notToScale is for the set-ups drawn at an angle: projectile, pendulum, and pulley with arrangement "incline"/;
  throwsSpec(K, { variant: 'pulley', arrangement: 'atwood', m1: 1, m2: 2, notToScale: true }, re);
  throwsSpec(K, { variant: 'pulley', arrangement: 'table', m1: 1, m2: 2, notToScale: true }, re);
  throwsSpec(K, { variant: 'spring_mass', k: 100, notToScale: true }, re);
  throwsSpec(K, { variant: 'collision', masses: [1, 1], before: [2, 0], after: 1, notToScale: true }, re);
  throwsSpec(K, { variant: 'circular', radius: 2, notToScale: true }, re);
  throwsSpec(K, { variant: 'pendulum', angle: 20, notToScale: 'yes' }, /notToScale must be true or false/);
});

void finish();
