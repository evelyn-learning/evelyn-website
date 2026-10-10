/**
 * Practice-figure renderer — batch 4 (2026-10-14), the whole-round checks:
 *   - nothing that was there changed unasked: all 168 fixtures of c9a204fa are
 *     pinned (scripts/lib/practice-figure-pins-c9a204fa.json); the ones this
 *     round redrew are listed one by one, each with the to-do (a–g) it was
 *     redrawn for, in practice-figure-changes-since-c9a204fa.json;
 *   - batch 4 is a list of its own;
 *   - every fixture of the round (new kinds and fixes) holds the shared
 *     invariants of scripts/lib/practice-figure-test-kit.ts.
 * Each part has a test file of its own for what its kinds draw, hide, refuse
 * and warn about: test-practice-figure-batch4-<part>.ts.
 *
 * Pure: no database, no network, no model.
 * Run: npm run test:practice-figure-batch4
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { BATCH2_FIGURE_KINDS, BATCH3_FIGURE_KINDS, BATCH4_FIGURE_KINDS, ALL_PRACTICE_FIGURE_KINDS, renderPracticeFigure, type PracticeFigureSpec } from '../src/lib/tutor/practice-figure/render';
import { BATCH4_FIXTURES, FIGURE_FIXTURES } from './lib/practice-figure-fixtures';
import { academySanitiser, fixtureInvariants, makeRunner, throwsSpec } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const readJson = (name: string): Record<string, string> => JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', name), 'utf8')) as Record<string, string>;
const sha = (spec: PracticeFigureSpec): string => createHash('sha256').update(renderPracticeFigure(spec).svg).digest('hex');
const BATCH4_IDS = new Set(BATCH4_FIXTURES.map((f) => f.id));

console.log('\nNothing that was there has changed unasked:\n');

test('all 168 fixtures as they were at c9a204fa: byte-identical, except exactly the ones listed (with the to-do a–g) as redrawn by this round', () => {
  const pins = readJson('practice-figure-pins-c9a204fa.json');
  const redrawn = readJson('practice-figure-changes-since-c9a204fa.json');
  assert.equal(Object.keys(pins).length, 168);
  const before = FIGURE_FIXTURES.filter((f) => !BATCH4_IDS.has(f.id));
  assert.deepEqual(before.map((f) => f.id), Object.keys(pins), 'same fixtures, same order');
  for (const id of Object.keys(redrawn)) {
    assert.ok(id in pins, `${id} is listed as changed but was not a fixture at c9a204fa`);
    assert.ok(/^[a-g] — /.test(redrawn[id]), `${id}: the reason names the to-do (a–g) it was changed for`);
  }
  const changed = before.filter((f) => sha(f.spec) !== pins[f.id]).map((f) => f.id);
  assert.deepEqual(changed, before.filter((f) => f.id in redrawn).map((f) => f.id), 'the fixtures that changed are exactly the listed ones');
});

test('batch 4 is a list of its own: none of its kinds in the earlier lists; an unknown kind names them all', () => {
  for (const k of BATCH4_FIGURE_KINDS) assert.ok(![...ALL_PRACTICE_FIGURE_KINDS, ...BATCH2_FIGURE_KINDS, ...BATCH3_FIGURE_KINDS].includes(k as never), k);
  throwsSpec('pie_chart', {}, new RegExp(`unknown figure kind .*function_graph.*schematic_map.*${BATCH4_FIGURE_KINDS.join('.*')}`));
  for (const k of BATCH4_FIGURE_KINDS) assert.ok(BATCH4_FIXTURES.some((f) => f.spec.type === k), `${k} has fixtures`);
  assert.equal(new Set(FIGURE_FIXTURES.map((f) => f.id)).size, FIGURE_FIXTURES.length, 'fixture ids are unique');
});

console.log('\nEvery batch-4 fixture:\n');

/** New kind or variant → the id prefix of its fixtures. */
const GROUPS: Record<string, string> = {
  'conic_graph (circle)': 'conic-circle-', 'conic_graph (ellipse)': 'conic-ellipse-', 'conic_graph (hyperbola)': 'conic-hyperbola-', 'conic_graph (parabola)': 'conic-parabola-',
  'conic_graph (two conics)': 'conic-', venn_diagram: 'venn-', probability_tree: 'tree-',
  'mechanics_setup (projectile)': 'mech-projectile-', 'mechanics_setup (pulley)': 'mech-pulley-', 'mechanics_setup (spring_mass)': 'mech-spring-',
  'mechanics_setup (pendulum)': 'mech-pendulum-', 'mechanics_setup (collision)': 'mech-collision-', 'mechanics_setup (circular)': 'mech-circular-',
  'wave_diagram (transverse)': 'wave-transverse-', 'wave_diagram (standing)': 'wave-standing-',
  'energy_levels (orbital_boxes)': 'orbital-', 'energy_levels (levels)': 'levels-', heating_curve: 'heating-',
  'electrochemical_cell (galvanic)': 'cell-', 'electrochemical_cell (electrolytic)': 'cell-electrolytic-',
  'sequence_strip (strands)': 'seq-strands-', 'sequence_strip (chromatogram)': 'seq-chromatogram-',
  'bar_chart (grouped series)': 'bars-grouped-',
};
fixtureInvariants(test, BATCH4_FIXTURES, GROUPS, ['a', 'b', 'c', 'd', 'e', 'g']);

test("the academy client's sanitiser also passes every EARLIER fixture as it is drawn now", async () => {
  const inspect = await academySanitiser();
  if (!inspect) {
    console.log('    (skipped: the academy worktree is not on this machine)');
    return;
  }
  for (const f of FIGURE_FIXTURES) {
    const svg = renderPracticeFigure(f.spec).svg;
    const res = inspect(svg);
    assert.ok(!('problem' in res), `${f.id}: ${'problem' in res ? res.problem : ''}`);
  }
});

void finish();
