/**
 * Unit test for the shaded-region runtime net (GreenApple round 6, Task 3).
 * Live 2026-09-24 (portal-7298bf27): the tutor said "…is shaded green" while
 * the board showed show_coordinate_plane (points + segments, no shading —
 * that tool cannot shade). The net plants a note to redraw with show_graph.
 *   npm run test:shaded-region-net
 */
import assert from 'node:assert';
import { shouldPlantShadedRegionNote } from '../src/lib/tutor/voice/shaded-region-net';

let passed = 0;
function check(label: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${label}`); }
  catch (e) { console.error(`  ✗ ${label}\n    ${e instanceof Error ? e.message : e}`); process.exitCode = 1; }
}

const plane = { name: 'show_coordinate_plane', args: { points: [{ x: 0, y: 0 }], segments: [] } };

console.log('shaded-region net');
check('"shaded" + show_coordinate_plane → plant', () => {
  assert.equal(shouldPlantShadedRegionNote({ speech: 'The region below the line is shaded green.', toolCalls: [plane] }), true);
});
check('"shade" + show_geometry → plant', () => {
  assert.equal(shouldPlantShadedRegionNote({ speech: 'We shade the part inside.', toolCalls: [{ name: 'show_geometry', args: {} }] }), true);
});
check('"shaded" + show_graph carrying shadedRegion → no plant', () => {
  assert.equal(shouldPlantShadedRegionNote({
    speech: 'The region below the line is shaded green.',
    toolCalls: [plane, { name: 'show_graph', args: { shadedRegion: { between: ['f', 'g'] } } }],
  }), false);
});
check('"shaded" + show_function_graph carrying shadedRegion → no plant', () => {
  assert.equal(shouldPlantShadedRegionNote({
    speech: 'That shaded area is the answer.',
    toolCalls: [plane, { name: 'show_function_graph', args: { shadedRegion: { from: 0, to: 1 } } }],
  }), false);
});
check('"shaded" + show_graph WITHOUT shadedRegion + plane → plant', () => {
  assert.equal(shouldPlantShadedRegionNote({
    speech: 'The shaded part is where both hold.',
    toolCalls: [plane, { name: 'show_graph', args: { functions: [] } }],
  }), true);
});
check('no "shade" word → no plant', () => {
  assert.equal(shouldPlantShadedRegionNote({ speech: 'Plot the point (2, 3).', toolCalls: [plane] }), false);
});
check('"shadow"/"shadows" are not "shade" words → no plant', () => {
  assert.equal(shouldPlantShadedRegionNote({ speech: 'The shadow is 4 meters long.', toolCalls: [plane] }), false);
});
check('"shaded" + no board tool → no plant', () => {
  assert.equal(shouldPlantShadedRegionNote({ speech: 'Imagine the region is shaded.', toolCalls: [] }), false);
  assert.equal(shouldPlantShadedRegionNote({ speech: 'Imagine the region is shaded.', toolCalls: [{ name: 'show_equation', args: { latex: 'y<2x' } }] }), false);
});
check('"Shading" capitalised → plant', () => {
  assert.equal(shouldPlantShadedRegionNote({ speech: 'Shading shows the solutions.', toolCalls: [plane] }), true);
});

// Fix round 1: the redraw note must reach the very next brain turn — it may
// NOT ride pendingRuntimeNoteRef (held up to 3 turns behind an open question).
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
check('wiring: plant site uses pendingRedrawNoteRef, never pendingRuntimeNoteRef', () => {
  const src = readFileSync(join(__dirname, '../src/app/tutor/components/VoiceTutorRealtime.tsx'), 'utf8');
  const start = src.indexOf('shouldPlantShadedRegionNote({');
  assert.ok(start > 0, 'plant site not found');
  const block = src.slice(start, src.indexOf('shaded_region_net_planted', start));
  assert.ok(block.length > 0, 'plant block not found');
  assert.ok(!block.includes('pendingRuntimeNoteRef'), 'plant site writes pendingRuntimeNoteRef (held note)');
  assert.ok(block.includes('pendingRedrawNoteRef.current'), 'plant site does not write pendingRedrawNoteRef');
  // Delivery is unconditional: consumed next to the board-anchor note, before the held runtime note.
  const deliver = src.indexOf('if (pendingRedrawNoteRef.current) {');
  assert.ok(deliver > 0, 'delivery site not found');
  const heldIdx = src.indexOf('if (pendingRuntimeNoteRef.current) {');
  assert.ok(deliver < heldIdx, 'redraw delivery must precede (and be outside) the held runtime-note block');
  const deliverBlock = src.slice(deliver, src.indexOf('}', deliver));
  assert.ok(!/openQuestionAtTurnStartRef|runtimeNoteHeldTurnsRef/.test(deliverBlock), 'redraw delivery must not be gated on an open question');
});

console.log(`\nshaded-region net: ${passed} checks passed`);
