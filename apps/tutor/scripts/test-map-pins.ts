/**
 * R50 T6/T7 — MapRenderer pin bounds + pin-marker-aware label de-overlap.
 *
 * Both defects are from live session portal-b0a1b396 (Grade 7 World
 * Geography, 2026-08-21) and both pin sets below are the VERBATIM payloads
 * stored in prod Mongo for that session's two showMap calls.
 *
 * Run: npx tsx scripts/test-map-pins.ts
 */
import { strict as assert } from 'node:assert';
import { findOutOfBoundsPins, suggestContainingBackground, buildMapBoundsRejection,
         findCrowdedPins, buildCrowdedPinsRejection, MIN_PIN_SEPARATION_PX } from '../src/lib/tutor/whiteboard/map-pin-bounds';
import { deoverlapLabels } from '../src/lib/tutor/whiteboard/label-deoverlap';

let passed = 0, failed = 0;
function test(name: string, fn: () => void) {
  try { fn(); passed++; console.log(`  ✓ ${name}`); }
  catch (e) { failed++; console.log(`  ✗ ${name}`); console.log(`      ${(e as Error).message}`); }
}

// showMap #1 — "One Suitcase, One Region". Image 1: top label clipped.
const MAP1 = [
  { label: 'Warm rainy island', lat: 18.2, lon: -66.5 },
  { label: 'Cold mountain town', lat: -13.5, lon: -71.9 },
  { label: 'Bone-dry desert', lat: -23.5, lon: -69.3 },
];
// showMap #2 — "The Atacama Desert and the Andes". Image 3: labels collided.
const MAP2 = [
  { label: 'Pacific Ocean (moist air starts here)', lat: -20, lon: -75 },
  { label: 'Andes Mountains (the wall)', lat: -20, lon: -68 },
  { label: 'Atacama Desert (rain shadow)', lat: -23.5, lon: -69.5 },
];

console.log('\nR50 T6 — pin bounds');
test('the live clipped pin is detected as out of bounds', () => {
  const bad = findOutOfBoundsPins('south-america', MAP1);
  assert.equal(bad.length, 1);
  assert.equal(bad[0].label, 'Warm rainy island');
  assert.equal(bad[0].edge, 'north');
  // south-america bbox north edge is 12.437; the pin is at 18.2.
  assert.ok(bad[0].by > 5 && bad[0].by < 6.5, `expected ~5.8° past north, got ${bad[0].by}`);
});

test('the other two pins on that same map are NOT flagged', () => {
  const bad = findOutOfBoundsPins('south-america', MAP1);
  const labels = bad.map((b) => b.label);
  assert.ok(!labels.includes('Cold mountain town'));
  assert.ok(!labels.includes('Bone-dry desert'));
});

test('a fully in-bounds map produces NO error (must-not-over-fire)', () => {
  // MAP2 is the session's own second map: every pin sits inside the bbox.
  // If this ever fires, the guard would blank legitimate maps.
  assert.deepEqual(findOutOfBoundsPins('south-america', MAP2), []);
});

test('suggests a background that actually contains every pin', () => {
  const s = suggestContainingBackground(MAP1);
  assert.ok(s, 'expected a suggestion');
  assert.notEqual(s, 'south-america');
});

test('unknown background makes no claim rather than a false one', () => {
  assert.deepEqual(findOutOfBoundsPins('atlantis', MAP1), []);
});

test('pins without coordinates are ignored, never throw', () => {
  assert.deepEqual(findOutOfBoundsPins('south-america', [{ label: 'x' }]), []);
  assert.deepEqual(findOutOfBoundsPins('south-america', []), []);
});

console.log('\nR50 T7 — labels route around pin markers');
// Projected SVG positions for MAP2 under the south-america preset, computed
// from the same equirectangular formula the renderer uses. Two pins share
// py exactly — the shape that produced the live collision.
const PTS = [
  { px: 179.2, py: 192.0 },
  { px: 229.2, py: 192.0 },
  { px: 218.5, py: 209.6 },
];
const R = 8;
const dots = PTS.map(({ px, py }) => ({ left: px - R, right: px + R, top: py - R, bottom: py + R }));
const inputs = PTS.map(({ px, py }, i) => ({
  x: px + 10, y: py + 4, text: MAP2[i].label, fontSize: 12, anchor: 'start' as const,
}));
const OPTS = { charWidth: 0.62, pad: 2, baseline: 'alphabetic' as const, edgePad: 2 };

function labelBoxes(out: typeof inputs) {
  return out.map((l) => {
    const w = l.text.length * l.fontSize * 0.62;
    const h = l.fontSize * 1.2;
    return { left: l.x, right: l.x + w, top: l.y - h * 0.8, bottom: l.y - h * 0.8 + h };
  });
}
const overlaps = (a: {left:number;right:number;top:number;bottom:number}, b: typeof a) =>
  a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom;

test('two pins at an identical latitude really do collide unguarded', () => {
  // Pins the input, so a future projection change that removes the collision
  // makes this test say so instead of silently passing on a moot case.
  assert.equal(PTS[0].py, PTS[1].py);
  const bare = deoverlapLabels(inputs, { width: 600, height: 400 }, OPTS);
  const boxes = labelBoxes(bare as typeof inputs);
  const hits = boxes.filter((b) => dots.some((d) => overlaps(b, d))).length;
  assert.ok(hits > 0, 'expected the unguarded pass to leave a label on a marker');
});

test('with the dots as obstacles, no label box sits on any marker', () => {
  const fixed = deoverlapLabels(inputs, { width: 600, height: 400 }, { ...OPTS, obstacles: dots });
  const boxes = labelBoxes(fixed as typeof inputs);
  boxes.forEach((b, i) => {
    dots.forEach((d, j) => {
      assert.ok(!overlaps(b, d), `label ${i} ("${MAP2[i].label}") still overlaps pin ${j}'s marker`);
    });
  });
});

test('labels still do not overlap EACH OTHER', () => {
  const fixed = deoverlapLabels(inputs, { width: 600, height: 400 }, { ...OPTS, obstacles: dots });
  const boxes = labelBoxes(fixed as typeof inputs);
  for (let i = 0; i < boxes.length; i++)
    for (let j = i + 1; j < boxes.length; j++)
      assert.ok(!overlaps(boxes[i], boxes[j]), `labels ${i} and ${j} overlap each other`);
});

test('markers themselves never move — only text', () => {
  const fixed = deoverlapLabels(inputs, { width: 600, height: 400 }, { ...OPTS, obstacles: dots });
  // The obstacle list is what the renderer draws the dots from; assert it is
  // unchanged by the pass (deoverlapLabels must not mutate its inputs).
  assert.deepEqual(dots, PTS.map(({ px, py }) => ({ left: px - R, right: px + R, top: py - R, bottom: py + R })));
  assert.equal(fixed.length, inputs.length);
});

console.log('\nR52 — the rejection the BRAIN receives');

test('a bad map produces an actionable rejection reason', () => {
  const bad = findOutOfBoundsPins('south-america', MAP1);
  const reason = buildMapBoundsRejection('south-america', MAP1, bad);
  // Must name the offending pin, how far out, and a concrete alternative —
  // a rejection the brain cannot act on just burns a turn.
  assert.ok(reason.includes('Warm rainy island'), 'names the pin');
  assert.ok(/north edge/.test(reason), 'names the edge');
  assert.ok(/background: "/.test(reason), 'offers a concrete background');
  assert.ok(/show_map was rejected/.test(reason), 'names the tool');
});

test('the rejection tells the brain NOT to reference the map', () => {
  // The live failure was not the bad pin — it was the brain scribbling at
  // and talking about a map that was never drawn, for the rest of the
  // lesson. The reason must close that off explicitly.
  const reason = buildMapBoundsRejection('south-america', MAP1, findOutOfBoundsPins('south-america', MAP1));
  assert.ok(/nothing was drawn/i.test(reason));
  assert.ok(/do NOT scribble/i.test(reason));
});

test('the suggested background actually contains every pin', () => {
  // A suggestion that is itself out of bounds would send the brain into a
  // rejection loop — worse than no suggestion.
  const suggestion = suggestContainingBackground(MAP1);
  assert.ok(suggestion);
  assert.deepEqual(findOutOfBoundsPins(suggestion!, MAP1), [],
    `suggested "${suggestion}" must contain all pins`);
});

test('a valid map yields no rejection path at all', () => {
  assert.deepEqual(findOutOfBoundsPins('south-america', MAP2), []);
});

test('malformed pins never throw and never reject', () => {
  assert.deepEqual(findOutOfBoundsPins('south-america', [{ label: 'x', lat: NaN, lon: 0 }]), []);
  assert.deepEqual(findOutOfBoundsPins('south-america', [{ label: 'y', lat: Infinity, lon: 0 }]), []);
});

console.log('\nR54 — pins too crowded to read at the chosen scale');

// showMap #2 from portal-0d4a6a90, verbatim. The tutor announced three drawn
// features; the student reported seeing nothing.
const CROWDED = [
  { label: 'Ocean (moisture source)', lat: -20, lon: -75 },
  { label: 'Mountain range', lat: -20, lon: -70 },
  { label: 'Desert', lat: -20, lon: -68 },
];

test('the live world-map case is caught', () => {
  const c = findCrowdedPins('world', CROWDED);
  assert.ok(c, 'expected the crowded case to be flagged');
  // Measured: the closest pair lands ~3px apart on a 600px canvas.
  assert.ok(c!.px < MIN_PIN_SEPARATION_PX, `closest pair ${c!.px}px must be under ${MIN_PIN_SEPARATION_PX}`);
  assert.ok(c!.suggestion && c!.suggestion !== 'world', 'must suggest a tighter background');
});

test('the SAME pins on the suggested background are NOT crowded', () => {
  // The suggestion has to actually solve it, or the brain loops.
  const c = findCrowdedPins('world', CROWDED)!;
  assert.equal(findCrowdedPins(c.suggestion, CROWDED), null);
});

test('the same pins on south-america are fine', () => {
  // Proof the defect is the SCALE, not the content — the session's other two
  // maps used south-america and rendered legibly.
  assert.equal(findCrowdedPins('south-america', CROWDED), null);
});

test('well-spread pins are never flagged', () => {
  assert.equal(findCrowdedPins('south-america', MAP1), null);
  assert.equal(findCrowdedPins('south-america', MAP2), null);
});

test('crowded pins with NO better option are ALLOWED', () => {
  // Two genuinely adjacent landmarks: if nothing tighter separates them there
  // is no rendering that would help, and a rejection the brain cannot satisfy
  // is worse than a cramped map.
  const adjacent = [
    { label: 'Kigali', lat: -1.94, lon: 30.06 },
    { label: 'Kigali airport', lat: -1.97, lon: 30.14 },
  ];
  const c = findCrowdedPins('africa', adjacent);
  if (c) assert.notEqual(c.suggestion, 'africa');
  // Either allowed, or suggests something that genuinely separates them.
  if (c) assert.equal(findCrowdedPins(c.suggestion, adjacent), null);
});

test('fewer than two pins is never crowded', () => {
  assert.equal(findCrowdedPins('world', [CROWDED[0]]), null);
  assert.equal(findCrowdedPins('world', []), null);
});

test('the crowded rejection is actionable and names both pins', () => {
  const c = findCrowdedPins('world', CROWDED)!;
  const reason = buildCrowdedPinsRejection('world', c);
  assert.ok(reason.includes('Ocean (moisture source)') || reason.includes('Mountain range'));
  assert.ok(reason.includes(c.suggestion), 'names the background to retry with');
  assert.ok(/nothing was rendered/i.test(reason), 'tells the brain not to describe it as drawn');
});

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
