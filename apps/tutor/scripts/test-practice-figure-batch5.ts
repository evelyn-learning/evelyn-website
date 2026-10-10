/**
 * Practice-figure renderer — batch 5 (2026-10-16), the whole-round checks:
 *   - nothing that was there changed unasked: all 264 fixtures of b85c7ae5 are
 *     pinned (scripts/lib/practice-figure-pins-b85c7ae5.json); the ones this
 *     round redrew are listed one by one, each with the to-do (a–k) it was
 *     redrawn for, in practice-figure-changes-since-b85c7ae5.json;
 *   - batch 5 is a list of its own;
 *   - every fixture of the round (new kinds and fixes) holds the shared
 *     invariants of scripts/lib/practice-figure-test-kit.ts.
 * Each part has a test file of its own for what its kinds draw, hide, refuse
 * and warn about: test-practice-figure-batch5-<part>.ts.
 *
 * Pure: no database, no network, no model.
 * Run: npm run test:practice-figure-batch5
 */
import './lib/no-db-env';
import { strict as assert } from 'node:assert';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { BATCH2_FIGURE_KINDS, BATCH3_FIGURE_KINDS, BATCH4_FIGURE_KINDS, BATCH5_FIGURE_KINDS, ALL_PRACTICE_FIGURE_KINDS, renderPracticeFigure, type PracticeFigureSpec } from '../src/lib/tutor/practice-figure/render';
import { BATCH5_FIXTURES, FIGURE_FIXTURES } from './lib/practice-figure-fixtures';
import { academySanitiser, fixtureInvariants, makeRunner, throwsSpec } from './lib/practice-figure-test-kit';

const { test, finish } = makeRunner();
const readJson = (name: string): Record<string, string> => JSON.parse(fs.readFileSync(path.join(__dirname, 'lib', name), 'utf8')) as Record<string, string>;
const sha = (spec: PracticeFigureSpec): string => createHash('sha256').update(renderPracticeFigure(spec).svg).digest('hex');
const BATCH5_IDS = new Set(BATCH5_FIXTURES.map((f) => f.id));

console.log('\nNothing that was there has changed unasked:\n');

test('all 264 fixtures as they were at b85c7ae5: byte-identical, except exactly the ones listed (with the to-do a–k) as redrawn by this round', () => {
  const pins = readJson('practice-figure-pins-b85c7ae5.json');
  const redrawn = readJson('practice-figure-changes-since-b85c7ae5.json');
  assert.equal(Object.keys(pins).length, 264);
  const before = FIGURE_FIXTURES.filter((f) => !BATCH5_IDS.has(f.id));
  assert.deepEqual(before.map((f) => f.id), Object.keys(pins), 'same fixtures, same order');
  for (const id of Object.keys(redrawn)) {
    assert.ok(id in pins, `${id} is listed as changed but was not a fixture at b85c7ae5`);
    assert.ok(/^[a-k] — /.test(redrawn[id]), `${id}: the reason names the to-do (a–k) it was changed for`);
  }
  const changed = before.filter((f) => sha(f.spec) !== pins[f.id]).map((f) => f.id);
  assert.deepEqual(changed, before.filter((f) => f.id in redrawn).map((f) => f.id), 'the fixtures that changed are exactly the listed ones');
});

test('batch 5 is a list of its own: none of its kinds in the earlier lists; an unknown kind names them all', () => {
  for (const k of BATCH5_FIGURE_KINDS) assert.ok(![...ALL_PRACTICE_FIGURE_KINDS, ...BATCH2_FIGURE_KINDS, ...BATCH3_FIGURE_KINDS, ...BATCH4_FIGURE_KINDS].includes(k as never), k);
  throwsSpec('pie_chart', {}, new RegExp(`unknown figure kind .*function_graph.*schematic_map.*sequence_strip.*${BATCH5_FIGURE_KINDS.join('.*')}`));
  for (const k of BATCH5_FIGURE_KINDS) assert.ok(BATCH5_FIXTURES.some((f) => f.spec.type === k), `${k} has fixtures`);
  assert.equal(new Set(FIGURE_FIXTURES.map((f) => f.id)).size, FIGURE_FIXTURES.length, 'fixture ids are unique');
});

console.log('\nEvery batch-5 fixture:\n');

/** New kind or variant → the id prefix of its fixtures. */
const GROUPS: Record<string, string> = {
  replication_fork: 'fork-', operon_map: 'operon-', cell_cycle_wheel: 'cycle-',
  transformer: 'transformer-', 'induction_loop (magnet)': 'induction-magnet-', 'induction_loop (field region)': 'induction-field-',
  doppler_wavefronts: 'doppler-', 'photoelectric_setup (tube)': 'photo-tube-', 'photoelectric_setup (KE graph)': 'photo-graph-',
  data_table: 'table-', 'solid_3d (frustum)': 'solid-frustum-',
};
fixtureInvariants(test, BATCH5_FIXTURES, GROUPS, ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k'], 'fix5');

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
