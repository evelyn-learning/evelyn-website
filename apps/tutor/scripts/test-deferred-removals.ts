/**
 * Evolve-in-place without an empty board: the superseded figure is removed in
 * the same paint as its replacement (lib/tutor/whiteboard/deferred-removals.ts),
 * plus source scans proving VoiceTutorRealtime wires it.
 *
 * Run: npm run test:deferred-removals
 */
import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  DEFERRED_REMOVAL_MAX_MS,
  deferRemoval,
  takeRemovalsForBatch,
  takeRemovalsForIds,
  takeStaleRemovals,
  type DeferredRemovals,
} from '../src/lib/tutor/whiteboard/deferred-removals';

let passed = 0;
let failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); console.log(`PASS  ${name}`); passed++; }
  catch (err) { console.log(`FAIL  ${name}\n      ${(err as Error).message}`); failed++; }
}
const T = 1_800_000_000_000;

test('the prior is released only by the batch that paints its replacement', () => {
  const p: DeferredRemovals = new Map();
  deferRemoval(p, 'showTree-2', ['showTree-1'], T);
  assert.deepEqual(takeRemovalsForBatch(p, [{ action: 'scribble', id: 'scribble-1' }, { action: 'scrollTo' }]), []);
  assert.equal(p.size, 1);
  assert.deepEqual(takeRemovalsForBatch(p, [{ action: 'showTree', id: 'showTree-2' }]), ['showTree-1']);
  assert.equal(p.size, 0);
  assert.deepEqual(takeRemovalsForBatch(p, [{ action: 'showTree', id: 'showTree-2' }]), [], 'released once');
});

test('several priors for one replacement, and several replacements in one batch', () => {
  const p: DeferredRemovals = new Map();
  deferRemoval(p, 'b', ['a1'], T);
  deferRemoval(p, 'b', ['a2', 'a1'], T + 5);
  deferRemoval(p, 'd', ['c'], T);
  assert.equal(p.get('b')?.atMs, T, 'age counts from the first deferral');
  assert.deepEqual(takeRemovalsForBatch(p, [{ id: 'b' }, { id: 'd' }, null, 7, { id: 9 }]).sort(), ['a1', 'a2', 'c']);
});

test('a replacement dropped before painting still releases its prior', () => {
  const p: DeferredRemovals = new Map();
  deferRemoval(p, 'new', ['old'], T);
  assert.deepEqual(takeRemovalsForIds(p, ['other']), []);
  assert.deepEqual(takeRemovalsForIds(p, ['new', 'other']), ['old']);
  assert.equal(p.size, 0);
});

test('a replacement that never paints releases its prior after the limit', () => {
  const p: DeferredRemovals = new Map();
  deferRemoval(p, 'new', ['old'], T);
  deferRemoval(p, 'fresh', ['x'], T + DEFERRED_REMOVAL_MAX_MS);
  assert.deepEqual(takeStaleRemovals(p, T + DEFERRED_REMOVAL_MAX_MS - 1), []);
  assert.deepEqual(takeStaleRemovals(p, T + DEFERRED_REMOVAL_MAX_MS), ['old']);
  assert.deepEqual(Array.from(p.keys()), ['fresh']);
});

// ── Wiring (source scans) ──
const vtr = readFileSync(join(__dirname, '..', 'src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
const flags = readFileSync(join(__dirname, '..', 'src/lib/tutor/orchestrator/flags.ts'), 'utf8');

test('flag defaults ON', () => {
  assert.match(flags, /TUTOR_EVOLVE_SWAP = process\.env\.NEXT_PUBLIC_TUTOR_EVOLVE_SWAP !== 'off'/);
});

test('VTR: every paint goes through the wrapper that releases owed removals first', () => {
  assert.match(vtr, /onWhiteboardCommand: onWhiteboardCommandProp,/);
  const w = vtr.slice(vtr.indexOf('const onWhiteboardCommand = useCallback('), vtr.indexOf('}, [onWhiteboardCommandProp]);'));
  assert.match(w, /takeRemovalsForBatch\(deferredRemovalsRef\.current, commands\)/);
  assert.ok(w.indexOf("action: 'removeItems'") < w.lastIndexOf('onWhiteboardCommandProp(commands, meta)'), 'removal first, then the batch, in one tick');
});

test('VTR: evolve removals are parked under their replacement; unpaired ones go at once', () => {
  assert.match(vtr, /deferRemoval\(deferredRemovalsRef\.current, replacementId, priors, Date\.now\(\)\)/);
  assert.match(vtr, /'figure_evolve_deferred'/);
  assert.match(vtr, /if \(immediate\.length > 0\) onWhiteboardCommandProp\(\[\{ action: 'removeItems', ids: immediate \}\]\);/);
});

test('VTR: dropped and never-painted replacements release their prior', () => {
  assert.match(vtr, /takeRemovalsForIds\(deferredRemovalsRef\.current, ids\)/);
  assert.match(vtr, /takeStaleRemovals\(deferredRemovalsRef\.current, Date\.now\(\)\)/);
});

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
