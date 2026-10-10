/**
 * Practice-figure renderer — batch 4, part "mech": mechanics_setup and its six
 * variants (projectile, pulley, spring_mass, pendulum, collision, circular)
 * — src/lib/tutor/practice-figure/kinds/mechanics.ts.
 *
 * Under test: the shared fixture invariants (scripts/lib/practice-figure-test-kit.ts);
 * per variant what is drawn, what each `show` option hides or blanks, the
 * model behind the picture, the refusals (each names its param) and the
 * variant's own legibility notes.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch4-mech.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { MECHANICS_VARIANTS, mechanicsModel } from '../src/lib/tutor/practice-figure/kinds/mechanics';
import { FIXTURES } from './lib/practice-figure-fixtures-b4-mech';
import { count, fixtureInvariants, has, makeRunner, near, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const K = 'mechanics_setup';
const svg = (p: Params): string => svgOf(K, p);
const model = (p: Params) => mechanicsModel(reader(K, p));
const refuses = (p: Params, re: RegExp): void => throwsSpec(K, p, re);
const BLANK_BOX = /stroke-dasharray="3 2"/g;

console.log('\nEvery mech fixture:\n');

const GROUPS: Record<string, string> = {
  'mechanics_setup (projectile)': 'mech-projectile-', 'mechanics_setup (pulley)': 'mech-pulley-', 'mechanics_setup (spring_mass)': 'mech-spring-',
  'mechanics_setup (pendulum)': 'mech-pendulum-', 'mechanics_setup (collision)': 'mech-collision-', 'mechanics_setup (circular)': 'mech-circular-',
};
const rendered = fixtureInvariants(test, FIXTURES, GROUPS);

test('every fixture is mechanics_setup, every variant has fixtures, and an unknown variant is refused by name', () => {
  for (const f of FIXTURES) assert.equal(f.spec.type, K, f.id);
  for (const v of MECHANICS_VARIANTS) assert.ok(FIXTURES.some((f) => f.spec.params.variant === v), v);
  refuses({ variant: 'lever' }, /variant must be one of projectile, pulley, spring_mass, pendulum, collision, circular/);
  refuses({ variant: 'pendulum', angle: 20, show: { speed: 'value' } }, /show\.speed is not a quantity of this variant — one of angle, length, mass, height/);
  refuses({ variant: 'pendulum', angle: 20, show: { angle: 'hidden' } }, /show\.angle must be one of value, blank, none/);
  refuses({ variant: 'pendulum', angle: 20, show: { length: 'value' } }, /show\.length is "value" but length is not given/);
  refuses({ variant: 'pendulum', angle: 20, g: 0 }, /g must be greater than 0/);
  assert.ok(has(svg({ variant: 'pendulum', angle: 20, title: 'A pendulum' }), 'A pendulum'));
});

console.log('\nprojectile:\n');

test('projectile: the model is the kinematics — time, range, apex — and the path is a true parabola to one scale', () => {
  const m = model({ variant: 'projectile', speed: 20, angle: 30 });
  const pj = m.projectile!;
  near(pj.time, 40 * 0.5 / 9.8, 1e-9);
  near(pj.range, 20 * Math.cos(Math.PI / 6) * pj.time, 1e-9);
  near(pj.maxHeight, 100 / 19.6, 1e-9);
  near(pj.impactSpeed, 20, 1e-9);
  const t = model({ variant: 'projectile', speed: 3, angle: 0, height: 1.225 }).projectile!;
  near(t.time, 0.5, 1e-9);
  near(t.range, 1.5, 1e-9);
  near(t.maxHeight, 1.225, 1e-12);
  // The drawn path: 61 points, the same pixels per metre across and up.
  const s = rendered.get('mech-projectile-angled') as string;
  const d = /<path d="(M[^"]+)" fill="none" stroke="#1d4ed8" stroke-width="1\.8" stroke-dasharray="5 4"\/>/.exec(s)?.[1] ?? assert.fail('no path');
  const pts = [...d.matchAll(/[ML](-?[\d.]+),(-?[\d.]+)/g)].map((q) => [Number(q[1]), Number(q[2])]);
  assert.equal(pts.length, 61);
  const sx = (pts[60][0] - pts[0][0]) / pj.range;
  const apexY = Math.min(...pts.map((q) => q[1]));
  near((pts[0][1] - apexY) / pj.maxHeight, sx, 0.02 * sx);
  near(pts[60][1], pts[0][1], 0.02);
});

test('projectile: speed, angle, height, range and maximum height are each a value, a "?" or absent; computed lengths print to three figures', () => {
  const base = { variant: 'projectile', speed: 25, angle: 53.13, height: 25, g: 10 };
  const all = svg({ ...base, show: { range: 'value', maxHeight: 'value' } });
  assert.deepEqual(texts(all).sort(), ['25 m', '45 m', '53.1°', '75 m', 'v₀ = 25 m/s'].sort());
  assert.equal(count(all, BLANK_BOX), 0);
  const none = svg({ ...base, show: { speed: 'none', angle: 'none', height: 'none' } });
  assert.deepEqual(texts(none), []);
  const blanks = svg({ ...base, show: { speed: 'blank', angle: 'blank', height: 'blank', range: 'blank', maxHeight: 'blank' } });
  assert.deepEqual(texts(blanks).sort(), ['?', '?', '?', '?', '?', 'v₀ ='].sort());
  assert.equal(count(blanks, BLANK_BOX), 5);
  assert.ok(!/25|53|45|75/.test(texts(blanks).join(' ')), 'no value under a blank');
  assert.ok(has(svg({ ...base, symbols: { speed: 'v' } }), 'v = 25 m/s'));
  assert.ok(has(svg({ variant: 'projectile', speed: 20, angle: 30, show: { range: 'value' } }), '35.3 m'));
  assert.ok(has(svg({ ...base, lengthUnit: 'ft', speedUnit: 'ft/s' }), '25 ft') && has(svg({ ...base, lengthUnit: 'ft', speedUnit: 'ft/s' }), 'v₀ = 25 ft/s'));
  // Lettered points: a dot and a letter each, never a number.
  const pts = svg({ ...base, points: [{ at: 'apex', label: 'P' }, { at: 4, label: 'Q' }, { at: 'landing', label: 'R' }], show: { speed: 'none', angle: 'none', height: 'none' } });
  assert.deepEqual(texts(pts), ['P', 'Q', 'R']);
});

test('projectile: refusals and notes', () => {
  refuses({ variant: 'projectile', angle: 30 }, /speed must be a finite number/);
  refuses({ variant: 'projectile', speed: 20, angle: 90 }, /angle must be between 0 and 85 degrees/);
  refuses({ variant: 'projectile', speed: 20, angle: 0 }, /never leaves it — give an angle or a height/);
  refuses({ variant: 'projectile', speed: 20, angle: 30, height: -1 }, /height must be 0 or more/);
  refuses({ variant: 'projectile', speed: 20, angle: 30, show: { height: 'value' } }, /show\.height: the launch is from the ground/);
  refuses({ variant: 'projectile', speed: 20, angle: 0, height: 5, show: { maxHeight: 'blank' } }, /show\.maxHeight: a level launch is highest at the launch point/);
  refuses({ variant: 'projectile', speed: 20, angle: 0, height: 5, show: { angle: 'value' } }, /show\.angle: a level launch has no angle/);
  refuses({ variant: 'projectile', speed: 20, angle: 30, points: [{ at: 9, label: 'P' }] }, /points\[0\]\.at must be "apex", "landing" or a time between 0 and the time of flight \(2\.041 s\)/);
  refuses({ variant: 'projectile', speed: 20, angle: 0, height: 5, points: [{ at: 'apex', label: 'P' }] }, /points\[0\]\.at: a level launch has no apex/);
  refuses({ variant: 'projectile', speed: 20, angle: 30, platform: 'roof' }, /platform must be one of cliff, table/);
  // A path that is a sliver when drawn to scale is reported, not stretched.
  assert.ok(warn(K, { variant: 'projectile', speed: 40, angle: 3 }).includes('crowded'));
  assert.ok(warn(K, { variant: 'projectile', speed: 1, angle: 0, height: 80 }).includes('crowded'));
  assert.ok(warn(K, { variant: 'projectile', speed: 20, angle: 45, points: [1, 2, 3, 4, 5, 6].map((i) => ({ at: i * 0.4, label: String.fromCharCode(74 + i) })) }).includes('too_many_elements'));
});

console.log('\npulley:\n');

test('pulley: three arrangements; block names inside, masses beside — value, "?" or absent; angle and μ likewise; blocks one size', () => {
  const atwood = rendered.get('mech-pulley-atwood') as string;
  assert.deepEqual(texts(atwood).sort(), ['3 kg', '5 kg', 'm₁', 'm₂']);
  // The two blocks are the same size whatever the masses.
  const blocks = [...atwood.matchAll(/<path d="M[-\d.]+,[-\d.]+h([\d.]+)v([\d.]+)h-[\d.]+z" fill="#e5e7eb"/g)].map((q) => `${q[1]}×${q[2]}`);
  assert.deepEqual(blocks, ['48×38', '48×38']);
  assert.equal(svg({ variant: 'pulley', arrangement: 'atwood', m1: 3, m2: 5, show: { m1: 'none', m2: 'none' } }), svg({ variant: 'pulley', arrangement: 'atwood', m1: 50, m2: 1, show: { m1: 'none', m2: 'none' } }), 'with the masses hidden the picture does not depend on them');
  const incline = rendered.get('mech-pulley-incline-dense') as string;
  assert.deepEqual(texts(incline).sort(), ['30°', '4 kg', '6 kg', 'm₁', 'm₂', 'μ = 0.2'].sort());
  const hidden = svg({ variant: 'pulley', arrangement: 'incline', m1: 4, m2: 6, angle: 30, mu: 0.2, show: { m1: 'blank', m2: 'none', angle: 'blank', mu: 'blank' }, symbols: { m1: 'A', m2: 'B' } });
  assert.deepEqual(texts(hidden).sort(), ['?', '?', '?', 'A', 'B', 'μ ='].sort());
  const table = rendered.get('mech-pulley-table-blank-mass') as string;
  assert.deepEqual(texts(table).sort(), ['6 kg', '?', 'frictionless', 'm₁', 'm₂'].sort());
  assert.equal(count(table, BLANK_BOX), 1);
  // Steep and shallow inclines both draw, clean.
  for (const angle of [15, 20, 40, 55]) assert.deepEqual(warn(K, { variant: 'pulley', arrangement: 'incline', m1: 1, m2: 2, angle, frictionless: true }), [], String(angle));
});

test('pulley: refusals', () => {
  refuses({ variant: 'pulley', m1: 1, m2: 2 }, /arrangement must be one of atwood, table, incline/);
  refuses({ variant: 'pulley', arrangement: 'atwood', m1: 0, m2: 2 }, /m1 must be greater than 0/);
  refuses({ variant: 'pulley', arrangement: 'incline', m1: 1, m2: 2 }, /angle must be a finite number/);
  refuses({ variant: 'pulley', arrangement: 'incline', m1: 1, m2: 2, angle: 70 }, /angle must be between 15 and 55 degrees/);
  refuses({ variant: 'pulley', arrangement: 'table', m1: 1, m2: 2, angle: 30 }, /angle is for arrangement "incline" only/);
  refuses({ variant: 'pulley', arrangement: 'atwood', m1: 1, m2: 2, mu: 0.1 }, /mu is for arrangements "table" and "incline" only/);
  refuses({ variant: 'pulley', arrangement: 'table', m1: 1, m2: 2, mu: 0.1, frictionless: true }, /frictionless and mu > 0 contradict each other/);
  refuses({ variant: 'pulley', arrangement: 'table', m1: 1, m2: 2, show: { mu: 'value' } }, /show\.mu is "value" but mu is not given/);
});

console.log('\nspring_mass:\n');

test('spring_mass: horizontal and vertical; stretched, compressed or at equilibrium; k, m and x each a value, a "?" or absent', () => {
  assert.deepEqual(texts(rendered.get('mech-spring-horizontal') as string).sort(), ['0.15 m', 'equilibrium', 'k = 200 N/m', 'm'].sort());
  assert.deepEqual(texts(rendered.get('mech-spring-vertical-dense') as string).sort(), ['0.04 m', '0.5 kg', 'equilibrium', 'k = 80 N/m'].sort());
  const blank = rendered.get('mech-spring-blank-compressed') as string;
  assert.deepEqual(texts(blank).sort(), ['2 kg', '?', 'equilibrium', 'k = 800 N/m'].sort());
  assert.ok(!texts(blank).join(' ').includes('0.1'));
  // At equilibrium nothing marks a displacement; the block carries its symbol.
  assert.deepEqual(texts(svg({ variant: 'spring_mass' })), ['m']);
  assert.deepEqual(texts(svg({ variant: 'spring_mass', symbols: { m: 'M' }, k: 50, show: { k: 'blank' } })).sort(), ['?', 'M', 'k ='].sort());
  // The sketch is schematic: the drawn stretch does not depend on the size of x.
  assert.equal(svg({ variant: 'spring_mass', x: 0.05, show: { x: 'none' } }), svg({ variant: 'spring_mass', x: 0.5, show: { x: 'none' } }));
  assert.equal(svg({ variant: 'spring_mass', state: 'compressed' }), svg({ variant: 'spring_mass', x: -3, show: { x: 'none' } }));
  assert.equal(model({ variant: 'spring_mass', x: -0.1 }).spring!.state, 'compressed');
  near(model({ variant: 'spring_mass', x: -0.1 }).q.x.value as number, 0.1);
  for (const orientation of ['horizontal', 'vertical']) for (const x of [-0.2, 0.2]) assert.deepEqual(warn(K, { variant: 'spring_mass', orientation, k: 1250, m: 12.5, x, show: { x: 'blank', k: 'blank', m: 'blank' } }), [], `${orientation} ${x}`);
});

test('spring_mass: refusals', () => {
  refuses({ variant: 'spring_mass', k: -5 }, /k must be greater than 0/);
  refuses({ variant: 'spring_mass', orientation: 'diagonal' }, /orientation must be one of horizontal, vertical/);
  refuses({ variant: 'spring_mass', x: 0.1, state: 'compressed' }, /state "compressed" contradicts x \(positive: stretched\)/);
  refuses({ variant: 'spring_mass', show: { x: 'blank' } }, /show\.x: the block is drawn at equilibrium/);
  refuses({ variant: 'spring_mass', show: { m: 'value' } }, /show\.m is "value" but m is not given/);
});

console.log('\npendulum:\n');

test('pendulum: drawn at its true angle; angle, length, mass and the computed height each a value, a "?" or absent', () => {
  const s = rendered.get('mech-pendulum-length') as string;
  assert.deepEqual(texts(s).sort(), ['20°', 'L = 0.99 m'].sort());
  // The string: from the pivot to the bob, 20° from the vertical.
  const str = /<path d="M([\d.]+),([\d.]+)L([\d.]+),([\d.]+)" fill="none" stroke="#111827" stroke-width="1\.6"\/>/.exec(s) ?? assert.fail('no string');
  near((Math.atan2(Number(str[3]) - Number(str[1]), Number(str[4]) - Number(str[2])) * 180) / Math.PI, 20, 0.05);
  const dense = rendered.get('mech-pendulum-dense-points') as string;
  assert.deepEqual(texts(dense).sort(), ['50°', 'L = 2 m', 'X', 'Y', 'Z', 'h = 0.714 m', 'm = 0.5 kg'].sort());
  near(model({ variant: 'pendulum', angle: 60, length: 1.2 }).q.height.value as number, 0.6, 1e-12);
  const blank = rendered.get('mech-pendulum-blank-height') as string;
  assert.deepEqual(texts(blank).sort(), ['60°', '?', 'L = 1.2 m', 'h ='].sort());
  assert.ok(!texts(blank).join(' ').includes('0.6'));
  // The height can be asked for without a length; it cannot be printed without one.
  assert.deepEqual(texts(svg({ variant: 'pendulum', angle: 40, show: { height: 'blank', angle: 'blank' } })).sort(), ['?', '?', 'h ='].sort());
  refuses({ variant: 'pendulum', angle: 40, show: { height: 'value' } }, /show\.height is "value" but height is not given/);
  assert.deepEqual(texts(svg({ variant: 'pendulum', angle: 40, length: 1, mass: 2, show: { angle: 'none', length: 'none', mass: 'none' }, showVertical: false })), []);
  for (const angle of [5, 15, 30, 45, 80]) assert.deepEqual(warn(K, { variant: 'pendulum', angle, length: 1.5, mass: 0.25 }), [], String(angle));
});

test('pendulum: refusals and notes', () => {
  refuses({ variant: 'pendulum' }, /angle must be a finite number/);
  refuses({ variant: 'pendulum', angle: 85 }, /angle must be between 3 and 80 degrees from the vertical/);
  refuses({ variant: 'pendulum', angle: 30, length: 0 }, /length must be greater than 0/);
  refuses({ variant: 'pendulum', angle: 30, points: [{ angle: 120, label: 'A' }] }, /points\[0\]\.angle must be between −80 and 80 degrees/);
  refuses({ variant: 'pendulum', angle: 30, points: [{ angle: 10 }] }, /points\[0\]\.label must be a non-empty string/);
  // At a small angle the bob has barely risen: the height dimension cannot be read.
  assert.ok(warn(K, { variant: 'pendulum', angle: 10, length: 1, show: { height: 'blank' } }).includes('crowded'));
  assert.ok(warn(K, { variant: 'pendulum', angle: 6, points: [{ angle: 0, label: 'B' }] }).includes('crowded'), 'a marked position on top of the bob');
  assert.ok(warn(K, { variant: 'pendulum', angle: 40, points: [-40, -20, 0, 10, 20, 40].map((a, i) => ({ angle: a, label: 'PQRSTU'[i] })) }).includes('too_many_elements'));
});

console.log('\ncollision:\n');

test('collision: Before above After; speeds beside arrows that show direction only; a cart at rest says so; a blank velocity has no arrow', () => {
  const s = rendered.get('mech-collision-head-on') as string;
  assert.deepEqual(texts(s), ['Before', 'A', 'B', '2 kg', '2 kg', '4 m/s', 'at rest', 'After', 'A', 'B', '2 kg', '2 kg', '1 m/s', '3 m/s']);
  const arrows = (x: string): number => count(x, /<polygon [^>]*fill="#1d4ed8"\/>/g);
  assert.equal(arrows(s), 3);
  const o = rendered.get('mech-collision-dense-opposite') as string;
  assert.equal(arrows(o), 4);
  assert.ok(!texts(o).join(' ').includes('−'), 'a leftward velocity is a speed and an arrow, not a signed number');
  // All arrows one length: 44 units from tail to tip whatever the speed.
  const tips = [...o.matchAll(/<polygon points="([\d.]+),[\d.]+ [^"]*" fill="#1d4ed8"\/>/g)].map((q) => Number(q[1]));
  const tails = [...o.matchAll(/<path d="M([\d.]+),[\d.]+L[\d.]+,[\d.]+" fill="none" stroke="#1d4ed8"/g)].map((q) => Number(q[1]));
  assert.deepEqual(tips.map((t, i) => Math.round(Math.abs(t - tails[i]))), [44, 44, 44, 44]);
  const stick = rendered.get('mech-collision-blank-stick') as string;
  assert.equal(arrows(stick), 1, 'only the one printed velocity has an arrow');
  assert.equal(count(stick, BLANK_BOX), 1);
  assert.ok(!texts(stick).join(' ').includes('4.5'));
  // Every one of the six values can be blanked or dropped.
  const hidden = svg({ variant: 'collision', masses: [2, 2], before: [4, 0], after: [1, 3], show: { m1: 'blank', m2: 'none', u1: 'none', u2: 'blank', v1: 'blank', v2: 'none' } });
  assert.deepEqual(texts(hidden).filter((t) => !['Before', 'After', 'A', 'B'].includes(t)), ['?', '?', '?', '?']);
  assert.equal(arrows(hidden), 0);
});

test('collision: the numbers must be a possible collision', () => {
  refuses({ variant: 'collision', masses: [2, 2], before: [4, 0], after: [1, 2] }, /after: momentum is not conserved — 8 kg·m\/s before, 6 kg·m\/s after/);
  refuses({ variant: 'collision', masses: [1, 1], before: [2, 0], after: [-1, 3] }, /after: kinetic energy increases \(2 J before, 5 J after\) — set explosion: true/);
  assert.doesNotThrow(() => svg({ variant: 'collision', masses: [3, 1], before: [0, 0], after: [-2, 6], explosion: true }));
  refuses({ variant: 'collision', masses: [1, 1], before: [1, 2], after: [1, 2] }, /before: the carts never meet/);
  refuses({ variant: 'collision', masses: [1, 1], before: [3, 0], after: [3, 0] }, /after: the left cart would have to pass through the right cart/);
  refuses({ variant: 'collision', masses: [1], before: [3, 0], after: [0, 3] }, /masses must have between 2 and 2 entries/);
  refuses({ variant: 'collision', masses: [1, 1], before: [3, 0], after: [0, 3], labels: ['A', 'A'] }, /labels must be two different names/);
  const m = model({ variant: 'collision', masses: [1.5, 0.5], before: [6, 0], after: 4.5, show: { v2: 'blank' } });
  assert.ok(m.collision!.together && m.q.v1.show === 'blank' && m.q.v2.show === 'blank');
});

console.log('\ncircular:\n');

test('circular: path, object and centre; the velocity arrow along the tangent in the direction of travel, force / acceleration toward the centre', () => {
  const s = rendered.get('mech-circular-ball') as string;
  assert.deepEqual(texts(s).sort(), ['r = 0.8 m', 'v = 4 m/s'].sort());
  const geometry = (x: string, color: string): { tail: number[]; tip: number[] } => {
    const tip = new RegExp(`<polygon points="([-\\d.]+),([-\\d.]+) [^"]*" fill="${color}"/>`).exec(x) ?? assert.fail('no arrow');
    const tail = new RegExp(`<path d="M([-\\d.]+),([-\\d.]+)L[^"]*" fill="none" stroke="${color}"`).exec(x) ?? assert.fail('no shaft');
    return { tail: [Number(tail[1]), Number(tail[2])], tip: [Number(tip[1]), Number(tip[2])] };
  };
  const centre = /<circle cx="([\d.]+)" cy="([\d.]+)" r="84" fill="none"/.exec(s) ?? assert.fail('no circle');
  const [cx, cy] = [Number(centre[1]), Number(centre[2])];
  const v = geometry(s, '#1d4ed8');
  // Tangent: perpendicular to the radius through the object; counter-clockwise on screen.
  const rx = v.tail[0] - cx;
  const ry = v.tail[1] - cy;
  near(Math.hypot(rx, ry), 84, 0.05);
  const dx = v.tip[0] - v.tail[0];
  const dy = v.tip[1] - v.tail[1];
  near(rx * dx + ry * dy, 0, 0.5);
  assert.ok(rx * dy - ry * dx < 0, 'counter-clockwise as seen (screen y is down)');
  const cw = geometry(svg({ variant: 'circular', direction: 'clockwise' }), '#1d4ed8');
  assert.ok((cw.tail[0] - cx) * (cw.tip[1] - cw.tail[1]) - (cw.tail[1] - cy) * (cw.tip[0] - cw.tail[0]) > 0);
  const orbit = rendered.get('mech-circular-dense-orbit') as string;
  assert.deepEqual(texts(orbit).sort(), ['Earth', 'F', 'm = 400 kg', 'r = 7000 km', 'v = 7.5 km/s'].sort());
  const f = geometry(orbit, '#c2410c');
  // Toward the centre: the tip is nearer the centre than the tail, on the same line.
  assert.ok(Math.hypot(f.tip[0] - cx, f.tip[1] - cy) < Math.hypot(f.tail[0] - cx, f.tail[1] - cy) - 40);
  near((f.tip[0] - f.tail[0]) * (f.tail[1] - cy) - (f.tip[1] - f.tail[1]) * (f.tail[0] - cx), 0, 1);
});

test('circular: radius, speed and mass each a value, a "?" or absent; an arrow a question asks about can be left out; refusals', () => {
  const blank = rendered.get('mech-circular-blank-speed') as string;
  assert.deepEqual(texts(blank).sort(), ['?', 'a', 'm = 2 kg', 'r = 0.5 m', 'v ='].sort());
  assert.ok(/stroke="#c2410c" stroke-width="2\.2" stroke-dasharray="5 3"/.test(blank), 'the acceleration arrow is dashed as well as coloured');
  assert.deepEqual(texts(svg({ variant: 'circular', radius: 2, speed: 3, mass: 4, arrows: [], show: { radius: 'none', speed: 'none', mass: 'none' } })), []);
  assert.deepEqual(texts(svg({ variant: 'circular', radius: 2, speed: 3, arrows: ['velocity', 'force'], show: { radius: 'blank', speed: 'none' }, arrowLabels: { force: 'T' } })).sort(), ['?', 'T', 'r =', 'v'].sort());
  refuses({ variant: 'circular', arrows: ['velocity', 'torque'] }, /arrows\[1\] must be one of velocity, force, acceleration/);
  refuses({ variant: 'circular', arrows: ['force', 'acceleration'] }, /force and acceleration point the same way/);
  refuses({ variant: 'circular', arrows: ['force'], speed: 3 }, /show\.speed: the speed is printed at the velocity arrow/);
  refuses({ variant: 'circular', position: 400 }, /position must be at least 0 and under 360 degrees/);
  refuses({ variant: 'circular', direction: 'left' }, /direction must be one of counterclockwise, clockwise/);
  // Clean wherever the object is on the circle, both ways round.
  for (const direction of ['clockwise', 'counterclockwise']) for (let position = 0; position < 360; position += 30) {
    assert.deepEqual(warn(K, { variant: 'circular', radius: 1.25, speed: 12.5, mass: 0.25, position, direction, arrows: ['velocity', 'force'], center: 'Sun' }), [], `${direction} ${position}`);
  }
});

void finish();
