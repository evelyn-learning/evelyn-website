/**
 * Practice-figure renderer — batch 5, part "em": transformer
 * (kinds/transformer.ts) and induction_loop with its two variants, magnet and
 * field (kinds/induction-loop.ts).
 *
 * Under test: the shared fixture invariants (scripts/lib/practice-figure-test-kit.ts);
 * per kind what is drawn, what each `show` option hides or blanks, the model
 * behind the picture (Lenz's law worked from first principles), the refusals
 * (each names its param) and the kind's own legibility notes.
 *
 * Pure: no database, no network, no model.
 * Run: npx tsx scripts/test-practice-figure-batch5-em.ts
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { inductionModel, type FieldLoopModel, type MagnetLoopModel } from '../src/lib/tutor/practice-figure/kinds/induction-loop';
import { transformerModel } from '../src/lib/tutor/practice-figure/kinds/transformer';
import { FIXTURES } from './lib/practice-figure-fixtures-b5-em';
import { count, fixtureInvariants, has, makeRunner, reader, svgOf, texts, throwsSpec, warn, type Params } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const BLANK_BOX = /stroke-dasharray="3 2"/g;
const tsvg = (p: Params): string => svgOf('transformer', p);
const isvg = (p: Params): string => svgOf('induction_loop', p);
const tm = (p: Params) => transformerModel(reader('transformer', p));
const im = (p: Params) => inductionModel(reader('induction_loop', p));
const magnet = (p: Params): MagnetLoopModel => im({ variant: 'magnet', ...p }) as MagnetLoopModel;
const field = (p: Params): FieldLoopModel => im({ variant: 'field', ...p }) as FieldLoopModel;
/** The windings of a coil: its turn strokes carry this marker width. */
const TURN = /stroke-width="2.6" stroke-linecap="round"/g;

console.log('\nEvery em fixture:\n');

const GROUPS: Record<string, string> = { transformer: 'transformer-', 'induction_loop (magnet)': 'induction-magnet-', 'induction_loop (field)': 'induction-field-' };
const rendered = fixtureInvariants(test, FIXTURES, GROUPS, [], 'fix5');

console.log('\ntransformer:\n');

test('transformer: what is given is printed with its symbol and unit; what is not given is not printed', () => {
  const s = rendered.get('transformer-simple-step-down') as string;
  assert.ok(has(s, 'Primary') && has(s, 'Secondary'));
  assert.ok(has(s, 'N₁ = 500 turns') && has(s, 'N₂ = 100 turns') && has(s, 'V₁ = 120 V'));
  assert.ok(!texts(s).some((t) => /V₂|I₁|I₂|24/.test(t)), 'the secondary voltage (24 V) is nowhere');
  assert.equal(count(s, BLANK_BOX), 0);
  const d = rendered.get('transformer-dense-all-six') as string;
  for (const t of ['N₁ = 200 turns', 'N₂ = 1600 turns', 'V₁ = 12 V', 'V₂ = 96 V', 'I₁ = 5 A', 'I₂ = 0.625 A', 'iron core', 'R = 153.6 Ω', 'An ideal transformer']) assert.ok(has(d, t), t);
  const own = rendered.get('transformer-blank-current-step-up') as string;
  assert.ok(has(own, 'Np = 50 turns') && has(own, 'Ip = 4 A') && has(own, 'Is ='));
  assert.ok(has(tsvg({ primary: { turns: 10, voltage: 2, label: 'Input coil' }, secondary: { turns: 20, label: 'Output coil' }, voltageUnit: 'kV' }), 'V₁ = 2 kV'));
  assert.ok(has(tsvg({ primary: { turns: 10, label: 'Input coil' }, secondary: { turns: 20, label: 'Output coil' } }), 'Output coil'));
});

test('transformer: show hides or blanks any of the six values; a blank never prints its value', () => {
  const base = { primary: { turns: 1000, voltage: 240, current: 0.5 }, secondary: { turns: 50, voltage: 12, current: 10 } };
  const values: Record<string, string> = { Np: '1000', Ns: '50', Vp: '240', Vs: '12 V', Ip: '0.5', Is: '10 A' };
  for (const k of Object.keys(values)) {
    const b = tsvg({ ...base, show: { [k]: 'blank' } });
    assert.equal(count(b, BLANK_BOX), 1, k);
    assert.ok(!texts(b).some((t) => t.includes(values[k])), `${k} blank still prints ${values[k]}`);
    const n = tsvg({ ...base, show: { [k]: 'none' } });
    assert.equal(count(n, BLANK_BOX), 0);
    assert.ok(!texts(n).some((t) => t.includes(values[k])), `${k} none still prints ${values[k]}`);
    assert.equal(texts(n).length, texts(tsvg(base)).length - 1);
  }
  // A value that is not given can still be asked for.
  assert.equal(count(tsvg({ primary: { turns: 500, voltage: 120 }, secondary: { turns: 100 }, show: { Vs: 'blank' } }), BLANK_BOX), 1);
});

test('transformer: the model knows the kind; the windings drawn say which coil has more turns without being its turns', () => {
  assert.equal(tm({ primary: { turns: 500 }, secondary: { turns: 100 } }).kind, 'step-down');
  assert.equal(tm({ primary: { turns: 50 }, secondary: { turns: 400 } }).kind, 'step-up');
  assert.equal(tm({ primary: { voltage: 12 }, secondary: { voltage: 96 } }).kind, 'step-up');
  assert.equal(tm({ primary: { turns: 80 }, secondary: { turns: 80 } }).kind, 'one-to-one');
  assert.deepEqual(tm({ primary: { turns: 500 }, secondary: { turns: 100 } }).loops, [8, 4]);
  assert.deepEqual(tm({ primary: { turns: 50 }, secondary: { turns: 51 } }).loops, [4, 8], 'schematic: more or fewer, never the ratio');
  assert.deepEqual(tm({ primary: { turns: 80 }, secondary: { turns: 80 } }).loops, [6, 6]);
  assert.deepEqual(tm({ primary: { turns: 500 }, secondary: { turns: 100 }, windings: 'equal' }).loops, [6, 6]);
  assert.deepEqual(tm({ primary: { turns: 6 }, secondary: { turns: 3 }, windings: 'counted' }).loops, [6, 3]);
  assert.equal(count(rendered.get('transformer-simple-step-down') as string, TURN), 12);
  assert.equal(count(rendered.get('transformer-blank-secondary-turns') as string, TURN), 12);
  assert.equal(count(rendered.get('transformer-counted-windings') as string, TURN), 9);
  // Two step-down transformers of different ratios are the same drawing (labels apart).
  const geo = (s: string): string => s.replace(/<text\b[^>]*>[\s\S]*?<\/text>/g, '');
  assert.equal(geo(tsvg({ primary: { turns: 500 }, secondary: { turns: 100 } })), geo(tsvg({ primary: { turns: 900 }, secondary: { turns: 300 } })));
});

test('transformer: source and load — AC by default, a battery for DC, a lamp, open terminals', () => {
  const ac = tsvg({ primary: { turns: 10 }, secondary: { turns: 20 } });
  const dc = tsvg({ primary: { turns: 10, voltage: 6 }, secondary: { turns: 20 }, source: 'dc' });
  const open = tsvg({ primary: { turns: 10 }, secondary: { turns: 20 }, source: 'none', load: 'none' });
  const lamp = tsvg({ primary: { turns: 10 }, secondary: { turns: 20 }, load: 'lamp' });
  assert.notEqual(ac, dc);
  assert.notEqual(ac, lamp);
  assert.equal(count(open, /<circle [^>]*r="3.2"/g), 4, 'four open terminals');
  assert.equal(tm({ primary: { turns: 10, voltage: 6 }, secondary: { turns: 20 }, source: 'dc' }).source, 'dc');
});

test('transformer: refusals name the param — inconsistent numbers, a value shown but not given, bad windings', () => {
  const r = (p: Params, re: RegExp): void => throwsSpec('transformer', p, re);
  r({ secondary: { turns: 5 } }, /primary must be an object/);
  r({ primary: { turns: 0 }, secondary: { turns: 5 } }, /primary\.turns must be greater than 0/);
  r({ primary: { turns: 2.5 }, secondary: { turns: 5 } }, /primary\.turns must be a whole number/);
  r({ primary: { turns: 500, voltage: 120 }, secondary: { turns: 100, voltage: 30 } }, /secondary\.voltage \(30\) does not fit the turns: an ideal transformer gives 24/);
  r({ primary: { voltage: 120, current: 2 }, secondary: { voltage: 24, current: 5 } }, /secondary\.current \(5\) does not fit the power: 120 × 2 = 240 on the primary side gives 10/);
  r({ primary: { turns: 500, current: 2 }, secondary: { turns: 100, current: 5 } }, /secondary\.current \(5\) does not fit the turns: an ideal transformer gives 10/);
  r({ primary: { turns: 500 }, secondary: { turns: 100 }, show: { Vs: 'value' } }, /show\.Vs is "value" but secondary\.voltage is not given/);
  r({ primary: { turns: 500 }, secondary: { turns: 100 }, show: { Vx: 'none' } }, /show\.Vx is not a quantity of a transformer — one of Np, Ns, Vp, Vs, Ip, Is/);
  r({ primary: { turns: 500 }, secondary: { turns: 100 }, show: { Np: 'hidden' } }, /show\.Np must be one of value, blank, none/);
  r({ primary: { current: 2 }, secondary: { current: 5 } }, /windings: "schematic" needs both turn counts or both voltages .* windings: "equal"/);
  r({ primary: { turns: 500 }, secondary: { turns: 100 }, windings: 'counted' }, /windings: "counted" draws every turn — at most 10 per coil \(primary\.turns is 500\)/);
  r({ primary: { turns: 5 }, secondary: { turns: 10 }, windings: 'spiral' }, /windings must be one of schematic, equal, counted/);
  r({ primary: { turns: 5 }, secondary: { turns: 10 }, source: 'solar' }, /source must be one of ac, dc, none/);
  r({ primary: { turns: 5 }, secondary: { turns: 10 }, load: 'motor' }, /load must be one of resistor, lamp, none/);
  r({ primary: { turns: 5, voltage: 6 }, secondary: { turns: 10, voltage: 12 }, source: 'dc' }, /source: "dc" — a steady current induces nothing: secondary\.voltage must be 0 or left out/);
  r({ primary: { turns: 5 }, secondary: { turns: 10 }, efficiency: 1.2 }, /efficiency must be greater than 0 and at most 1/);
  // With an efficiency the currents follow the power, not the turns.
  assert.equal(tm({ primary: { voltage: 100, current: 2 }, secondary: { voltage: 20, current: 9 }, efficiency: 0.9 }).efficiency, 0.9);
});

test('transformer: a label too long for its column is reported', () => {
  assert.deepEqual(warn('transformer', { primary: { turns: 500, voltage: 120 }, secondary: { turns: 100 } }), []);
  assert.ok(warn('transformer', { primary: { turns: 500, voltage: 123456.5 }, secondary: { turns: 100 }, voltageUnit: 'volts' }).includes('crowded'));
});

console.log('\ninduction_loop — magnet:\n');

test("magnet: Lenz's law from first principles — N toward: counter-clockwise seen from the magnet; away, or an S pole, reverses it; at rest nothing", () => {
  assert.equal(magnet({ pole: 'N', motion: 'toward' }).sense, 'counterclockwise');
  assert.equal(magnet({ pole: 'N', motion: 'away' }).sense, 'clockwise');
  assert.equal(magnet({ pole: 'S', motion: 'toward' }).sense, 'clockwise');
  assert.equal(magnet({ pole: 'S', motion: 'away' }).sense, 'counterclockwise');
  assert.equal(magnet({ pole: 'N', motion: 'rest' }).sense, 'none');
  // The same law whichever side the magnet is drawn on …
  for (const side of ['left', 'right']) assert.equal(magnet({ pole: 'N', motion: 'toward', magnetSide: side }).sense, 'counterclockwise', side);
  // … but the arrow on the NEAR side of the loop flips with the side (a mirror image reverses a circulation).
  assert.equal(magnet({ pole: 'N', motion: 'toward' }).nearSide, 'up');
  assert.equal(magnet({ pole: 'N', motion: 'toward', magnetSide: 'right' }).nearSide, 'down');
  assert.equal(magnet({ pole: 'S', motion: 'toward' }).nearSide, 'down');
  assert.equal(magnet({ pole: 'N', motion: 'away' }).nearSide, 'down');
  assert.equal(magnet({ pole: 'N', motion: 'rest' }).nearSide, 'none');
});

test('magnet: the poles, the motion arrow and its label are drawn; the current only when asked for', () => {
  const s = rendered.get('induction-magnet-simple-north-toward') as string;
  assert.deepEqual(texts(s), ['v', 'S', 'N']);
  assert.equal(count(s, BLANK_BOX), 0);
  const cur = isvg({ variant: 'magnet', pole: 'N', motion: 'toward', current: 'value' });
  assert.ok(has(cur, 'I'));
  assert.equal(count(cur, /<polygon /g), count(s, /<polygon /g) + 1, 'one more arrowhead: the current');
  // Reversing the motion reverses the drawn current arrow.
  assert.notEqual(cur.replace(/<text[\s\S]*?<\/text>/g, ''), isvg({ variant: 'magnet', pole: 'S', motion: 'toward', current: 'value' }).replace(/<text[\s\S]*?<\/text>/g, ''));
  const rest = isvg({ variant: 'magnet', pole: 'N', motion: 'rest', current: 'value' });
  assert.ok(has(rest, 'at rest') && has(rest, 'I = 0'));
  const dense = rendered.get('induction-magnet-dense-coil-meter-current') as string;
  for (const t of ['v = 0.5 m/s', 'N = 200 turns', 'G', 'I', 'A magnet and a coil']) assert.ok(has(dense, t), t);
});

test('magnet: a blank current is a "?" box with no arrow and the same picture for either answer; blank poles hide N and S', () => {
  const geo = (p: Params): string => isvg({ variant: 'magnet', current: 'blank', ...p });
  assert.equal(count(geo({ pole: 'N', motion: 'toward' }), BLANK_BOX), 1);
  // Toward with N and away with N differ only in the motion arrow — the blank does not move or change.
  const a = geo({ pole: 'N', motion: 'toward', showPoles: 'blank' });
  const b = geo({ pole: 'S', motion: 'toward', showPoles: 'blank' });
  assert.equal(a, b, 'with the poles blank, N and S are the same picture');
  assert.ok(!texts(a).includes('N') && !texts(a).includes('S'));
  assert.equal(count(a, BLANK_BOX), 3);
  const p = rendered.get('induction-magnet-blank-poles') as string;
  assert.equal(count(p, BLANK_BOX), 2);
  assert.ok(has(p, 'I') && !texts(p).includes('N') && !texts(p).includes('S'));
});

test('magnet: refusals name the param; the legibility report flags blank poles with nothing to find them from', () => {
  const r = (p: Params, re: RegExp): void => throwsSpec('induction_loop', p, re);
  r({ variant: 'coil' }, /variant must be one of magnet, field/);
  r({ variant: 'magnet', motion: 'toward' }, /pole must be one of N, S/);
  r({ variant: 'magnet', pole: 'N' }, /motion must be one of toward, away, rest/);
  r({ variant: 'magnet', pole: 'N', motion: 'toward', magnetSide: 'top' }, /magnetSide must be one of left, right/);
  r({ variant: 'magnet', pole: 'N', motion: 'toward', current: 'arrow' }, /current must be one of value, blank, none/);
  r({ variant: 'magnet', pole: 'N', motion: 'toward', turns: 1.5 }, /turns must be a whole number of 1 or more/);
  r({ variant: 'magnet', pole: 'N', motion: 'toward', field: 'into' }, /field is for variant "field" only/);
  assert.ok(warn('induction_loop', { variant: 'magnet', pole: 'N', motion: 'toward', showPoles: 'blank' }).includes('ambiguous_blank'));
  assert.ok(warn('induction_loop', { variant: 'magnet', pole: 'N', motion: 'toward', showPoles: 'blank', current: 'blank' }).includes('ambiguous_blank'));
  assert.deepEqual(warn('induction_loop', { variant: 'magnet', pole: 'N', motion: 'toward', showPoles: 'blank', current: 'value' }), []);
});

console.log('\ninduction_loop — field:\n');

test("field: Lenz's law — entering an into-page field: counter-clockwise; leaving: clockwise; out of the page reverses both; wholly inside and steady: none", () => {
  assert.equal(field({ field: 'into', position: 'entering', direction: 'right' }).sense, 'counterclockwise');
  assert.equal(field({ field: 'into', position: 'entering', direction: 'left' }).sense, 'counterclockwise');
  assert.equal(field({ field: 'into', position: 'leaving', direction: 'right' }).sense, 'clockwise');
  assert.equal(field({ field: 'out', position: 'entering', direction: 'right' }).sense, 'clockwise');
  assert.equal(field({ field: 'out', position: 'leaving', direction: 'left' }).sense, 'counterclockwise');
  assert.equal(field({ field: 'into', position: 'inside', direction: 'right' }).sense, 'none');
  assert.equal(field({ field: 'into', position: 'inside' }).sense, 'none');
  assert.equal(field({ field: 'into', position: 'inside', change: 'increasing' }).sense, 'counterclockwise');
  assert.equal(field({ field: 'into', position: 'inside', change: 'decreasing' }).sense, 'clockwise');
  assert.equal(field({ field: 'out', position: 'inside', change: 'increasing' }).sense, 'clockwise');
  assert.equal(field({ field: 'into', position: 'entering', direction: 'right' }).flux, 'increasing');
  assert.equal(field({ field: 'into', position: 'leaving', direction: 'right' }).flux, 'decreasing');
  assert.equal(field({ field: 'into', position: 'inside', direction: 'right' }).flux, 'steady');
});

test('field: crosses for into the page, dots for out of it — told apart without colour; none under a label; the region is a dashed outline', () => {
  const into = rendered.get('induction-field-simple-entering') as string;
  const out = isvg({ variant: 'field', field: 'out', position: 'entering', direction: 'right' });
  const dots = (s: string): number => count(s, /<circle [^>]*r="2.4" fill="#111827"\/>/g);
  const crosses = (s: string): number => count(s, /<path d="M[\d.]+,[\d.]+l7,7m-7,0l7,-7"/g);
  assert.ok(crosses(into) >= 20 && dots(into) === 0, `${crosses(into)} crosses`);
  assert.ok(dots(out) >= 20 && crosses(out) === 0, `${dots(out)} dots`);
  assert.equal(crosses(into), dots(out), 'the same grid either way');
  assert.deepEqual(texts(into), ['v']);
  assert.ok(/stroke-dasharray="6 4"/.test(into));
});

test('field: printed quantities, the current arrows, "I = 0", and the blanks', () => {
  const d = rendered.get('induction-field-dense-leaving-values') as string;
  for (const t of ['B = 0.5 T', 'L = 0.2 m', 'v = 4 m/s', 'R = 2 Ω', 'I', 'A loop pulled out of a magnetic field']) assert.ok(has(d, t), t);
  const noCur = isvg({ variant: 'field', field: 'out', position: 'leaving', direction: 'right', B: 0.5, length: 0.2, speed: 4, resistance: 2 });
  assert.equal(count(d, /<polygon /g), count(noCur, /<polygon /g) + 2, 'two current arrowheads');
  assert.ok(!has(noCur, 'I'));
  const zero = rendered.get('induction-field-inside-no-current') as string;
  assert.ok(has(zero, 'I = 0'));
  const b = rendered.get('induction-field-blank-current-increasing') as string;
  assert.equal(count(b, BLANK_BOX), 1);
  assert.ok(has(b, 'B increasing'));
  // The blank current is the same picture whichever way the answer goes, labels apart.
  const pic = (p: Params): string => isvg({ variant: 'field', position: 'inside', current: 'blank', field: 'into', ...p }).replace(/<text[\s\S]*?<\/text>/g, '');
  assert.equal(pic({ change: 'increasing' }), pic({ change: 'decreasing' }));
  const fb = rendered.get('induction-field-blank-field-direction') as string;
  assert.ok(has(fb, 'field direction:') && count(fb, BLANK_BOX) === 2);
  assert.equal(count(fb, /l7,7m-7,0l7,-7/g) + count(fb, /r="2.4" fill="#111827"/g), 0, 'no dots or crosses when the direction is asked');
  assert.equal(isvg({ variant: 'field', field: 'out', position: 'leaving', direction: 'left', current: 'value', showField: 'blank' }).replace(/<polygon[^>]*>/g, '').length,
    isvg({ variant: 'field', field: 'into', position: 'leaving', direction: 'left', current: 'value', showField: 'blank' }).replace(/<polygon[^>]*>/g, '').length, 'only the arrowheads differ');
  for (const k of ['B', 'length', 'speed', 'resistance']) {
    const s = isvg({ variant: 'field', field: 'out', position: 'leaving', direction: 'right', B: 0.5, length: 0.2, speed: 4, resistance: 2, show: { [k]: 'blank' } });
    assert.equal(count(s, BLANK_BOX), 1, k);
  }
});

test('field: refusals name the param; a blank field with nothing to find it from is reported', () => {
  const r = (p: Params, re: RegExp): void => throwsSpec('induction_loop', { variant: 'field', ...p }, re);
  r({ position: 'inside' }, /field must be one of into, out/);
  r({ field: 'into', position: 'above' }, /position must be one of entering, inside, leaving/);
  r({ field: 'into', position: 'entering' }, /direction must be one of left, right — a loop that is entering or leaving the region is moving/);
  r({ field: 'into', position: 'entering', direction: 'right', change: 'increasing' }, /change is for a loop at rest wholly inside the region \(position "inside", no direction\)/);
  r({ field: 'into', position: 'inside', direction: 'right', change: 'increasing' }, /change is for a loop at rest/);
  r({ field: 'into', position: 'inside', change: 'growing' }, /change must be one of increasing, decreasing/);
  r({ field: 'into', position: 'inside', B: -1 }, /B must be greater than 0/);
  r({ field: 'into', position: 'inside', show: { length: 'value' } }, /show\.length is "value" but length is not given/);
  r({ field: 'into', position: 'inside', show: { mass: 'none' } }, /show\.mass is not a quantity of this variant — one of B, length, speed, resistance/);
  r({ field: 'into', position: 'inside', showField: 'none' }, /showField must be one of value, blank/);
  r({ field: 'into', position: 'inside', pole: 'N' }, /pole is for variant "magnet" only/);
  assert.ok(warn('induction_loop', { variant: 'field', field: 'into', position: 'entering', direction: 'right', showField: 'blank' }).includes('ambiguous_blank'));
  assert.deepEqual(warn('induction_loop', { variant: 'field', field: 'into', position: 'entering', direction: 'right', showField: 'blank', current: 'value' }), []);
  assert.ok(warn('induction_loop', { variant: 'field', field: 'into', position: 'inside', direction: 'right', showField: 'blank', current: 'value' }).includes('ambiguous_blank'), 'no current: the direction cannot be found');
});

void finish();
