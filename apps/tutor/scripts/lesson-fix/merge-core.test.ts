/**
 * Tests for scripts/lesson-fix/merge-core.ts (pure).
 * Run from apps/tutor:  env -u MONGODB_URI npx tsx scripts/lesson-fix/merge-core.test.ts
 */
import '../lib/no-db-env';
import assert from 'node:assert/strict';
import type { PatchFile } from './core';
import { mergeFollowUps, type FollowUpPatch } from './merge-core';

let passed = 0;
function test(name: string, fn: () => void): void {
  fn();
  passed += 1;
  console.log(`ok - ${name}`);
}

const P = 'gen-00000000-0000-4000-8000-000000000001';
const writer = (): PatchFile[] => [
  {
    file: 'physics.json', subject: 'Physics', skipped: [],
    patches: [
      { pack: '001', planId: P, segmentId: `${P}.lo-1-try`, findings: ['w'], check: 'writer check', changes: [
        { path: 'problem', old: 'stored problem', new: 'writer problem' },
        { path: 'expectedAnswer', old: 'stored key', new: 'writer key' },
      ] },
      { pack: '001', planId: P, segmentId: `${P}.lo-2-try`, changes: [{ path: 'expectedAnswer', old: '−6', new: '6' }] },
    ],
  },
  { file: 'algebra_2.json', subject: 'Algebra 2', skipped: [], patches: [] },
];
const fu = (segmentId: string, changes: FollowUpPatch['changes'], extra: Partial<FollowUpPatch> = {}): FollowUpPatch =>
  ({ item: 'x', subject: 'Physics', pack: '001', planId: P, segmentId, findings: ['f'], check: 'recheck', changes, ...extra });

test('chained: the final change keeps the stored old and takes the follow-up new', () => {
  const r = mergeFollowUps(writer(), [fu(`${P}.lo-1-try`, [{ path: 'problem', old: 'writer problem', new: 'final problem', base: 'after-existing-patch' }])]);
  assert.deepEqual(r.problems, []);
  const p = r.files[0].patches[0];
  assert.deepEqual(p.changes, [
    { path: 'problem', old: 'stored problem', new: 'final problem' },
    { path: 'expectedAnswer', old: 'stored key', new: 'writer key' },
  ]);
  assert.equal(p.check, 'writer check | Re-check: recheck');
  assert.deepEqual(r.notes.map((n) => n.action), ['chained']);
  assert.equal(r.files[0].patches.length, 2);
});

test('a field the writer did not touch is added; a new segment becomes its own patch in the subject file', () => {
  const r = mergeFollowUps(writer(), [
    fu(`${P}.lo-2-try`, [{ path: 'problem', old: 'stored p2', new: 'p2 with g', base: 'after-existing-patch' }]),
    fu(`${P}.lo-3-try`, [{ path: 'problem', old: 'stored p3', new: 'new p3', base: 'after-existing-patch' }]),
    fu(`${P}.lo-9`, [{ path: 'objective.description', old: 'o', new: 'n', base: 'original' }], { subject: 'Algebra 2', pack: '777' }),
  ]);
  assert.deepEqual(r.problems, []);
  assert.deepEqual(r.files[0].patches[1].changes, [{ path: 'expectedAnswer', old: '−6', new: '6' }, { path: 'problem', old: 'stored p2', new: 'p2 with g' }]);
  assert.deepEqual(r.files[0].patches[2].changes, [{ path: 'problem', old: 'stored p3', new: 'new p3' }]);
  assert.equal(r.files[1].patches.length, 1);
  assert.deepEqual(r.notes.map((n) => n.action), ['added-field', 'new-patch', 'new-patch']);
});

test('a broken chain leaves BOTH out and is reported', () => {
  const r = mergeFollowUps(writer(), [fu(`${P}.lo-1-try`, [{ path: 'problem', old: 'not what the writer wrote', new: 'x', base: 'after-existing-patch' }])]);
  assert.deepEqual(r.problems.map((n) => n.action), ['chain-broken']);
  assert.deepEqual(r.files[0].patches.map((p) => p.segmentId), [`${P}.lo-2-try`]);
});

test('base "original" on a field the writer changed is a conflict: both out', () => {
  const r = mergeFollowUps(writer(), [fu(`${P}.lo-2-try`, [{ path: 'expectedAnswer', old: '−6', new: '7', base: 'original' }])]);
  assert.deepEqual(r.problems.map((n) => n.action), ['conflict']);
  assert.equal(r.files[0].patches.length, 1);
});

test('replaceExisting removes the writer patch and keeps only the follow-up', () => {
  const r = mergeFollowUps(writer(), [fu(`${P}.lo-2-try`, [{ path: 'problem', old: 'stored p2', new: 'other p2', base: 'original' }])],
    { replaceExisting: [{ planId: P, segmentId: `${P}.lo-2-try`, reason: 'stored key becomes right' }] });
  assert.deepEqual(r.problems, []);
  const p = r.files[0].patches.find((x) => x.segmentId === `${P}.lo-2-try`);
  assert.deepEqual(p?.changes, [{ path: 'problem', old: 'stored p2', new: 'other p2' }]);
  assert.deepEqual(r.notes.map((n) => n.action), ['replaced-existing']);
});

test('a follow-up that returns a field to its stored value drops the change; an emptied patch is removed', () => {
  const r = mergeFollowUps(writer(), [fu(`${P}.lo-2-try`, [{ path: 'expectedAnswer', old: '6', new: '−6', base: 'after-existing-patch' }])]);
  assert.deepEqual(r.notes.map((n) => n.action), ['net-no-op']);
  assert.equal(r.files[0].patches.length, 1);
});

test('a missing base or an unknown subject is a problem, and the input is never mutated', () => {
  const input = writer();
  const snapshot = JSON.stringify(input);
  const r = mergeFollowUps(input, [
    fu(`${P}.lo-1-try`, [{ path: 'problem', old: 'writer problem', new: 'x' }]),
    fu('other', [{ path: 'goal', old: 'a', new: 'b', base: 'original' }], { subject: 'Latin', pack: '999', planId: 'gen-x' }),
  ]);
  assert.deepEqual(r.problems.map((n) => n.action), ['bad-base', 'no-target-file']);
  assert.equal(JSON.stringify(input), snapshot);
  assert.equal(JSON.stringify(r.files), snapshot);
});

console.log(`\n${passed} tests passed`);
