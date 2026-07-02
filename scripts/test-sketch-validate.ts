/**
 * Unit tests for the sketch structural quality gate (validateSketch). The gate
 * is the in-loop half of the doodle quality decision, so the suite leans on the
 * NEGATIVE / fail-to-nothing cases (incoherent or mostly-garbage doodler output
 * must render NOTHING rather than something wrong).
 *
 * Usage: npx tsx scripts/test-sketch-validate.ts
 */
import { validateSketch } from '../src/lib/tutor/whiteboard/sketch-validate';
import { SKETCH_BOUNDS } from '../src/lib/tutor/whiteboard/sketch-schema';
import { BALL_ON_HILL, GLASS_SHATTER } from '../src/lib/tutor/whiteboard/sketch-examples';

let passed = 0, failed = 0;
function check(name: string, cond: boolean, detail?: string) {
  if (cond) { passed++; console.log(`  ✓ ${name}`); }
  else { failed++; console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`); }
}

// ── reference doodles survive ──
const ball = validateSketch({ primitives: BALL_ON_HILL });
check('BALL_ON_HILL validates', !!ball && ball.length === BALL_ON_HILL.length, JSON.stringify(ball?.length));
const glass = validateSketch({ primitives: GLASS_SHATTER });
check('GLASS_SHATTER validates', !!glass && glass.length === GLASS_SHATTER.length, JSON.stringify(glass?.length));

// ── accepts a bare array (not wrapped) ──
check('accepts bare array form', !!validateSketch(BALL_ON_HILL));

// ── fail-to-nothing on structurally broken input ──
check('null input → null', validateSketch(null) === null);
check('empty array → null', validateSketch({ primitives: [] }) === null);
check('non-array primitives → null', validateSketch({ primitives: 'nope' }) === null);
check('object without primitives → null', validateSketch({ foo: 1 }) === null);

// ── labels-only is not a sketch ──
check('labels-only → null', validateSketch({ primitives: [
  { type: 'label', x: 10, y: 10, text: 'hi' },
  { type: 'label', x: 20, y: 20, text: 'there' },
] }) === null);

// ── confusion guard: more dropped than kept → null ──
check('mostly-garbage → null', validateSketch({ primitives: [
  { type: 'line', x1: 10, y1: 10, x2: 50, y2: 50 }, // 1 good
  { type: 'bogus' },                                  // dropped
  { type: 'line' },                                   // dropped (no coords)
  { type: 'ellipse', cx: 5 },                         // dropped (missing radii)
] }) === null);

// ── individually-bad primitives are dropped, good ones kept ──
const mixed = validateSketch({ primitives: [
  { type: 'line', x1: 10, y1: 10, x2: 50, y2: 50 },
  { type: 'line', x1: 20, y1: 20, x2: 60, y2: 60 },
  { type: 'ellipse', cx: 30, cy: 30, rx: 5, ry: 5 },
  { type: 'line', x1: 5, y1: 5 }, // dropped: incomplete
] });
check('drops incomplete, keeps 3 good', !!mixed && mixed.length === 3, JSON.stringify(mixed?.length));

// ── coordinate clamping ──
const clamped = validateSketch({ primitives: [
  { type: 'line', x1: -50, y1: 10, x2: 9999, y2: 50 },
  { type: 'ellipse', cx: 50, cy: 50, rx: 10, ry: 10 },
] }) as any[];
check('coords clamp into 0..100', !!clamped && clamped[0].x1 === 0 && clamped[0].x2 === 100, JSON.stringify(clamped?.[0]));

// ── zero-length line dropped ──
check('zero-length line dropped (with a real prim present)',
  validateSketch({ primitives: [
    { type: 'ellipse', cx: 50, cy: 50, rx: 10, ry: 10 },
    { type: 'line', x1: 30, y1: 30, x2: 30, y2: 30 },
  ] })!.length === 1);

// ── bad color/strokeWidth coerced, primitive still kept ──
const coerced = validateSketch({ primitives: [
  { type: 'line', x1: 10, y1: 10, x2: 50, y2: 50, stroke: 'fuchsia', strokeWidth: 99 },
] }) as any[];
check('bad color dropped to default (undefined), kept', !!coerced && coerced[0].stroke === undefined);
check('strokeWidth clamped to max', !!coerced && coerced[0].strokeWidth === SKETCH_BOUNDS.maxStrokeWidth);

// ── polygon needs ≥3 vertices ──
check('2-point polygon dropped',
  validateSketch({ primitives: [
    { type: 'ellipse', cx: 50, cy: 50, rx: 10, ry: 10 },
    { type: 'polygon', points: [{ x: 10, y: 10 }, { x: 20, y: 20 }] },
  ] })!.length === 1);

// ── label text capped ──
const longLabel = validateSketch({ primitives: [
  { type: 'line', x1: 10, y1: 10, x2: 50, y2: 50 },
  { type: 'label', x: 10, y: 10, text: 'x'.repeat(200) },
] }) as any[];
check('label text capped to maxLabelLen',
  !!longLabel && longLabel.find((p) => p.type === 'label')?.text.length === SKETCH_BOUNDS.maxLabelLen);

// ── primitive cap enforced ──
const many = Array.from({ length: 60 }, (_, i) => ({ type: 'line', x1: i % 90, y1: 10, x2: (i % 90) + 5, y2: 50 }));
check('primitive count capped at maxPrimitives',
  validateSketch({ primitives: many })!.length === SKETCH_BOUNDS.maxPrimitives);

// ── concentric primitive (wavefronts) ──
const conc = validateSketch({ primitives: [
  { type: 'concentric', cx: 45, cy: 50, count: 4, spacing: 6.5, squeeze: 0.5, angle: 0 },
] }) as any[];
check('concentric validates', !!conc && conc.length === 1 && conc[0].type === 'concentric');
check('concentric count clamped to max',
  (validateSketch({ primitives: [{ type: 'concentric', cx: 50, cy: 50, count: 99, spacing: 5 }] }) as any[])[0].count
    === SKETCH_BOUNDS.maxConcentricCount);
check('concentric count clamped to min',
  (validateSketch({ primitives: [{ type: 'concentric', cx: 50, cy: 50, count: 1, spacing: 5 }] }) as any[])[0].count
    === SKETCH_BOUNDS.minConcentricCount);
check('concentric count rounded',
  (validateSketch({ primitives: [{ type: 'concentric', cx: 50, cy: 50, count: 3.7, spacing: 5 }] }) as any[])[0].count === 4);
check('concentric squeeze clamped to 0.9',
  (validateSketch({ primitives: [{ type: 'concentric', cx: 50, cy: 50, count: 3, spacing: 5, squeeze: 5 }] }) as any[])[0].squeeze === 0.9);
check('concentric with spacing<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'concentric', cx: 50, cy: 50, count: 3, spacing: 0 }] }) === null);
check('concentric missing spacing dropped → null',
  validateSketch({ primitives: [{ type: 'concentric', cx: 50, cy: 50, count: 3 }] }) === null);

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
