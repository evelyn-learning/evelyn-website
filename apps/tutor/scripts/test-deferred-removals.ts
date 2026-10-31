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
  takeDroppedReplacements,
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

// ── Task 22 §B (GDI run 10, 1233–1236 s): sentence-board replace keeps its prior on a drop ──
test('keepPriorOnDrop: a dropped replacement owes nothing; its prior is reported kept', () => {
  const p: DeferredRemovals = new Map();
  deferRemoval(p, 'showSentence-20', ['showSentence-18'], T, { keepPriorOnDrop: true });
  deferRemoval(p, 'showSentence-21', ['showSentence-19'], T, { keepPriorOnDrop: true });
  assert.deepEqual(takeDroppedReplacements(p, ['showSentence-20']), { owed: [], kept: ['showSentence-18'] });
  assert.deepEqual(takeRemovalsForIds(p, ['showSentence-21']), [], 'the old entry point owes nothing either');
  assert.equal(p.size, 0, 'both entries consumed');
});
test('without keepPriorOnDrop a dropped replacement still owes its prior (figure evolve unchanged)', () => {
  const p: DeferredRemovals = new Map();
  deferRemoval(p, 'new', ['old'], T);
  assert.deepEqual(takeDroppedReplacements(p, ['new']), { owed: ['old'], kept: [] });
  deferRemoval(p, 'new2', ['old2'], T, { keepPriorOnDrop: false });
  assert.deepEqual(takeRemovalsForIds(p, ['new2']), ['old2']);
});
test('keepPriorOnDrop: the paint still releases the prior with its replacement', () => {
  const p: DeferredRemovals = new Map();
  deferRemoval(p, 'showSentence-20', ['showSentence-18'], T, { keepPriorOnDrop: true });
  assert.deepEqual(takeRemovalsForBatch(p, [{ action: 'showSentence', id: 'showSentence-20' }]), ['showSentence-18']);
  deferRemoval(p, 's2', ['s1'], T, { keepPriorOnDrop: true });
  assert.deepEqual(takeStaleRemovals(p, T + DEFERRED_REMOVAL_MAX_MS), ['s1'], 'stale backstop unchanged');
});
test('a merged entry keeps its prior only if every deferral asked to', () => {
  const p: DeferredRemovals = new Map();
  deferRemoval(p, 'r', ['a'], T, { keepPriorOnDrop: true });
  deferRemoval(p, 'r', ['b'], T);
  assert.deepEqual(takeDroppedReplacements(p, ['r']), { owed: ['a', 'b'], kept: [] });
});

test('22 r1 m3: each stale backstop sweeps only its own kind of entry', () => {
  const p: DeferredRemovals = new Map();
  deferRemoval(p, 'showTree-2', ['showTree-1'], T);
  deferRemoval(p, 'showSentence-20', ['showSentence-18'], T, { keepPriorOnDrop: true });
  const late = T + DEFERRED_REMOVAL_MAX_MS;
  assert.deepEqual(takeStaleRemovals(p, late, DEFERRED_REMOVAL_MAX_MS, { keepPriorOnDrop: false }), ['showTree-1']);
  assert.deepEqual(Array.from(p.keys()), ['showSentence-20'], 'the sentence entry survives the figure sweep');
  assert.deepEqual(takeStaleRemovals(p, late, DEFERRED_REMOVAL_MAX_MS, { keepPriorOnDrop: true }), ['showSentence-18']);
  assert.equal(p.size, 0);
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
  assert.match(vtr, /const \{ owed, kept \} = takeDroppedReplacements\(deferredRemovalsRef\.current, ids\);/);
  // Task 22 §B: kept priors stay on the board; their bookkeeping is put back
  const drop = vtr.slice(vtr.indexOf('const dropRenderBuffer = useCallback('), vtr.indexOf("'render_sync_drop'"));
  assert.match(drop, /if \(kept\.length > 0\) \{[\s\S]*?autoSentenceCardIdsRef\.current\.add\(id\);\s*onDebugEvent\?\.\('sentence_board_auto_replace_kept', `\$\{id\} \(replacement retracted\)`\);[\s\S]*?catalogRef\.current\.restoreItems\(catalogItems\)/);
  assert.ok(!/removeItems', ids: kept/.test(drop), 'a kept prior is never removed');
  assert.match(vtr, /takeStaleRemovals\(deferredRemovalsRef\.current, Date\.now\(\), DEFERRED_REMOVAL_MAX_MS, \{ keepPriorOnDrop: false \}\)/);
  assert.match(vtr, /takeStaleRemovals\(deferredRemovalsRef\.current, Date\.now\(\), DEFERRED_REMOVAL_MAX_MS, \{ keepPriorOnDrop: true \}\)/);
  assert.equal((vtr.match(/takeStaleRemovals\(deferredRemovalsRef\.current, Date\.now\(\)\)/g) ?? []).length, 0, 'no unfiltered sweep left');
});

console.log(`\n${passed}/${passed + failed} passed`);
if (failed > 0) process.exit(1);
