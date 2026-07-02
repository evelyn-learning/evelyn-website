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
import {
  BALL_ON_HILL, GLASS_SHATTER,
  SPRING_MASS, TRANSVERSE_WAVE, SKIER, BEAKER_HALF,
} from '../src/lib/tutor/whiteboard/sketch-examples';

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

// ── wave primitive ──
const wave = validateSketch({ primitives: [
  { type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 3, amplitude: 14, damping: 0.5 },
] }) as any[];
check('wave validates', !!wave && wave.length === 1 && wave[0].type === 'wave');
check('wave cycles clamped to max',
  (validateSketch({ primitives: [{ type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 99, amplitude: 10 }] }) as any[])[0].cycles
    === SKETCH_BOUNDS.maxWaveCycles);
check('wave cycles clamped to min',
  (validateSketch({ primitives: [{ type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 0.01, amplitude: 10 }] }) as any[])[0].cycles
    === SKETCH_BOUNDS.minWaveCycles);
check('wave amplitude clamped to max',
  (validateSketch({ primitives: [{ type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 3, amplitude: 999 }] }) as any[])[0].amplitude
    === SKETCH_BOUNDS.maxAmplitude);
check('wave damping clamped to 0..1',
  (validateSketch({ primitives: [{ type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 3, amplitude: 10, damping: 5 }] }) as any[])[0].damping === 1);
check('wave coords clamp into 0..100',
  (validateSketch({ primitives: [{ type: 'wave', x1: -50, y1: 50, x2: 9999, y2: 50, cycles: 3, amplitude: 10 }] }) as any[])[0].x1 === 0);
check('wave with amplitude<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 3, amplitude: 0 }] }) === null);
check('wave missing cycles dropped → null',
  validateSketch({ primitives: [{ type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, amplitude: 10 }] }) === null);
check('wave zero-length segment dropped → null',
  validateSketch({ primitives: [{ type: 'wave', x1: 40, y1: 50, x2: 40, y2: 50, cycles: 3, amplitude: 10 }] }) === null);

// ── spring primitive ──
const spring = validateSketch({ primitives: [
  { type: 'spring', x1: 50, y1: 14, x2: 50, y2: 60, coils: 6, width: 6 },
] }) as any[];
check('spring validates', !!spring && spring.length === 1 && spring[0].type === 'spring');
check('spring coils clamped to max',
  (validateSketch({ primitives: [{ type: 'spring', x1: 50, y1: 10, x2: 50, y2: 60, coils: 99, width: 6 }] }) as any[])[0].coils
    === SKETCH_BOUNDS.maxCoils);
check('spring coils clamped to min',
  (validateSketch({ primitives: [{ type: 'spring', x1: 50, y1: 10, x2: 50, y2: 60, coils: 0, width: 6 }] }) as any[])[0].coils
    === SKETCH_BOUNDS.minCoils);
check('spring coils rounded',
  (validateSketch({ primitives: [{ type: 'spring', x1: 50, y1: 10, x2: 50, y2: 60, coils: 5.6, width: 6 }] }) as any[])[0].coils === 6);
check('spring width clamped to max',
  (validateSketch({ primitives: [{ type: 'spring', x1: 50, y1: 10, x2: 50, y2: 60, coils: 6, width: 999 }] }) as any[])[0].width
    === SKETCH_BOUNDS.maxSpringWidth);
check('spring with width<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'spring', x1: 50, y1: 10, x2: 50, y2: 60, coils: 6, width: 0 }] }) === null);
check('spring missing coils dropped → null',
  validateSketch({ primitives: [{ type: 'spring', x1: 50, y1: 10, x2: 50, y2: 60, width: 6 }] }) === null);

// ── stick_figure primitive ──
const stick = validateSketch({ primitives: [
  { type: 'stick_figure', x: 50, y: 50, scale: 30, pose: 'run' },
] }) as any[];
check('stick_figure validates + keeps pose', !!stick && stick[0].type === 'stick_figure' && stick[0].pose === 'run');
check('stick_figure scale clamped to max',
  (validateSketch({ primitives: [{ type: 'stick_figure', x: 50, y: 50, scale: 999 }] }) as any[])[0].scale
    === SKETCH_BOUNDS.maxStickScale);
check('stick_figure scale clamped to min',
  (validateSketch({ primitives: [{ type: 'stick_figure', x: 50, y: 50, scale: 1 }] }) as any[])[0].scale
    === SKETCH_BOUNDS.minStickScale);
check('stick_figure bad pose dropped to undefined',
  (validateSketch({ primitives: [{ type: 'stick_figure', x: 50, y: 50, scale: 30, pose: 'moonwalk' }] }) as any[])[0].pose === undefined);
check('stick_figure missing scale dropped → null',
  validateSketch({ primitives: [{ type: 'stick_figure', x: 50, y: 50 }] }) === null);

// ── container_fill primitive ──
const cont = validateSketch({ primitives: [
  { type: 'container_fill', x: 36, y: 26, w: 28, h: 46, fillFrac: 0.5, shape: 'beaker', fillColor: 'blue' },
] }) as any[];
check('container_fill validates + keeps shape/fillColor',
  !!cont && cont[0].type === 'container_fill' && cont[0].shape === 'beaker' && cont[0].fillColor === 'blue');
check('container_fill fillFrac clamped to 0..1',
  (validateSketch({ primitives: [{ type: 'container_fill', x: 10, y: 10, w: 30, h: 40, fillFrac: 5 }] }) as any[])[0].fillFrac === 1);
check('container_fill negative fillFrac clamped to 0',
  (validateSketch({ primitives: [{ type: 'container_fill', x: 10, y: 10, w: 30, h: 40, fillFrac: -2 }] }) as any[])[0].fillFrac === 0);
check('container_fill bad shape dropped to undefined',
  (validateSketch({ primitives: [{ type: 'container_fill', x: 10, y: 10, w: 30, h: 40, fillFrac: 0.5, shape: 'jug' }] }) as any[])[0].shape === undefined);
check('container_fill w<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'container_fill', x: 10, y: 10, w: 0, h: 40, fillFrac: 0.5 }] }) === null);
check('container_fill missing fillFrac dropped → null',
  validateSketch({ primitives: [{ type: 'container_fill', x: 10, y: 10, w: 30, h: 40 }] }) === null);

// ── new exemplars survive validation ──
for (const [name, prims] of [
  ['SPRING_MASS', SPRING_MASS], ['TRANSVERSE_WAVE', TRANSVERSE_WAVE],
  ['SKIER', SKIER], ['BEAKER_HALF', BEAKER_HALF],
] as const) {
  const v = validateSketch({ primitives: prims });
  check(`${name} validates`, !!v && v.length === prims.length, JSON.stringify(v?.length));
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
