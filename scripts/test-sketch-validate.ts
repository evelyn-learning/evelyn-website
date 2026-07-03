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
  TORQUE, TEN_FRAME, WAVELENGTH_BRACE, PENDULUM, GAS_CLOUD, MOLECULES_BOX,
  PULLEY_LIFT, LEVER_BALANCE, SPEEDOMETER, NUMBER_LINE,
  PLOT_POINT, PLANET_ORBIT, WATER_MOLECULE, BAR_HEIGHTS,
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

// ── vector primitive (Tier 3) ──
const vec = validateSketch({ primitives: [
  { type: 'vector', x1: 10, y1: 50, x2: 60, y2: 50, style: 'block', label: 'force' },
] }) as any[];
check('vector validates + keeps style/label', !!vec && vec[0].type === 'vector' && vec[0].style === 'block' && vec[0].label === 'force');
check('vector bad style dropped to undefined',
  (validateSketch({ primitives: [{ type: 'vector', x1: 10, y1: 50, x2: 60, y2: 50, style: 'zigzag' }] }) as any[])[0].style === undefined);
check('vector empty label dropped to undefined',
  (validateSketch({ primitives: [{ type: 'vector', x1: 10, y1: 50, x2: 60, y2: 50, label: '   ' }] }) as any[])[0].label === undefined);
check('vector coords clamp into 0..100',
  (validateSketch({ primitives: [{ type: 'vector', x1: -9, y1: 50, x2: 9999, y2: 50 }] }) as any[])[0].x2 === 100);
check('vector zero-length dropped → null',
  validateSketch({ primitives: [{ type: 'vector', x1: 40, y1: 50, x2: 40, y2: 50 }] }) === null);
check('vector missing endpoint dropped → null',
  validateSketch({ primitives: [{ type: 'vector', x1: 40, y1: 50, x2: 60 }] }) === null);

// ── grid primitive (Tier 3) ──
const grid = validateSketch({ primitives: [
  { type: 'grid', x: 20, y: 40, cols: 5, rows: 2, cell: 11, style: 'boxes', fillCount: 7 },
] }) as any[];
check('grid validates + keeps style/fillCount', !!grid && grid[0].type === 'grid' && grid[0].style === 'boxes' && grid[0].fillCount === 7);
check('grid cols clamped to max',
  (validateSketch({ primitives: [{ type: 'grid', x: 5, y: 5, cols: 99, rows: 2, cell: 3 }] }) as any[])[0].cols === SKETCH_BOUNDS.maxGridDim);
check('grid rows clamped to min',
  (validateSketch({ primitives: [{ type: 'grid', x: 5, y: 5, cols: 2, rows: 0, cell: 3 }] }) as any[])[0].rows === SKETCH_BOUNDS.minGridDim);
check('grid cols rounded',
  (validateSketch({ primitives: [{ type: 'grid', x: 5, y: 5, cols: 4.6, rows: 2, cell: 3 }] }) as any[])[0].cols === 5);
check('grid fillCount capped at cell total',
  (validateSketch({ primitives: [{ type: 'grid', x: 5, y: 5, cols: 5, rows: 2, cell: 3, fillCount: 99 }] }) as any[])[0].fillCount === 10);
check('grid bad style dropped to undefined',
  (validateSketch({ primitives: [{ type: 'grid', x: 5, y: 5, cols: 5, rows: 2, cell: 3, style: 'hexes' }] }) as any[])[0].style === undefined);
check('grid cell<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'grid', x: 5, y: 5, cols: 5, rows: 2, cell: 0 }] }) === null);
check('grid missing cell dropped → null',
  validateSketch({ primitives: [{ type: 'grid', x: 5, y: 5, cols: 5, rows: 2 }] }) === null);

// ── brace primitive (Tier 3) ──
const brace = validateSketch({ primitives: [
  { type: 'brace', x1: 14, y1: 56, x2: 50, y2: 56, side: 'bottom', label: 'one wavelength' },
] }) as any[];
check('brace validates + keeps side/label', !!brace && brace[0].type === 'brace' && brace[0].side === 'bottom' && brace[0].label === 'one wavelength');
check('brace bad side dropped to undefined',
  (validateSketch({ primitives: [{ type: 'brace', x1: 10, y1: 50, x2: 60, y2: 50, side: 'north' }] }) as any[])[0].side === undefined);
check('brace zero-length span dropped → null',
  validateSketch({ primitives: [{ type: 'brace', x1: 40, y1: 50, x2: 40, y2: 50 }] }) === null);
check('brace missing endpoint dropped → null',
  validateSketch({ primitives: [{ type: 'brace', x1: 40, y1: 50, x2: 60 }] }) === null);

// ── arc primitive (Tier 3) ──
const arc = validateSketch({ primitives: [
  { type: 'arc', cx: 50, cy: 14, r: 47, startAngle: 70, endAngle: 110 },
] }) as any[];
check('arc validates', !!arc && arc[0].type === 'arc' && arc[0].r === 47);
check('arc r clamped to max',
  (validateSketch({ primitives: [{ type: 'arc', cx: 50, cy: 50, r: 999, startAngle: 0, endAngle: 90 }] }) as any[])[0].r === SKETCH_BOUNDS.maxArcRadius);
check('arc coords clamp into 0..100',
  (validateSketch({ primitives: [{ type: 'arc', cx: -5, cy: 50, r: 20, startAngle: 0, endAngle: 90 }] }) as any[])[0].cx === 0);
check('arc r<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'arc', cx: 50, cy: 50, r: 0, startAngle: 0, endAngle: 90 }] }) === null);
check('arc zero sweep dropped → null',
  validateSketch({ primitives: [{ type: 'arc', cx: 50, cy: 50, r: 20, startAngle: 45, endAngle: 45 }] }) === null);
check('arc missing angle dropped → null',
  validateSketch({ primitives: [{ type: 'arc', cx: 50, cy: 50, r: 20, startAngle: 0 }] }) === null);

// ── blob primitive (Tier 3) ──
const blob = validateSketch({ primitives: [
  { type: 'blob', cx: 48, cy: 46, rx: 30, ry: 17, wobble: 0.32 },
] }) as any[];
check('blob validates + keeps wobble', !!blob && blob[0].type === 'blob' && blob[0].wobble === 0.32);
check('blob wobble clamped to max',
  (validateSketch({ primitives: [{ type: 'blob', cx: 50, cy: 50, rx: 20, ry: 20, wobble: 5 }] }) as any[])[0].wobble === SKETCH_BOUNDS.maxBlobWobble);
check('blob negative wobble clamped to 0',
  (validateSketch({ primitives: [{ type: 'blob', cx: 50, cy: 50, rx: 20, ry: 20, wobble: -3 }] }) as any[])[0].wobble === 0);
check('blob rx<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'blob', cx: 50, cy: 50, rx: 0, ry: 20 }] }) === null);
check('blob missing ry dropped → null',
  validateSketch({ primitives: [{ type: 'blob', cx: 50, cy: 50, rx: 20 }] }) === null);

// ── dots_cluster primitive (Tier 3) ──
const dots = validateSketch({ primitives: [
  { type: 'dots_cluster', cx: 50, cy: 50, count: 26, spread: 22 },
] }) as any[];
check('dots_cluster validates', !!dots && dots[0].type === 'dots_cluster' && dots[0].count === 26);
check('dots_cluster count clamped to max',
  (validateSketch({ primitives: [{ type: 'dots_cluster', cx: 50, cy: 50, count: 9999, spread: 20 }] }) as any[])[0].count === SKETCH_BOUNDS.maxDotsCount);
check('dots_cluster count floored at 1',
  (validateSketch({ primitives: [{ type: 'dots_cluster', cx: 50, cy: 50, count: 0, spread: 20 }] }) as any[])[0].count === 1);
check('dots_cluster spread clamped to max',
  (validateSketch({ primitives: [{ type: 'dots_cluster', cx: 50, cy: 50, count: 10, spread: 999 }] }) as any[])[0].spread === SKETCH_BOUNDS.maxSpread);
check('dots_cluster spread<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'dots_cluster', cx: 50, cy: 50, count: 10, spread: 0 }] }) === null);
check('dots_cluster missing spread dropped → null',
  validateSketch({ primitives: [{ type: 'dots_cluster', cx: 50, cy: 50, count: 10 }] }) === null);

// ── pulley primitive (Wave 3) ──
const pulley = validateSketch({ primitives: [
  { type: 'pulley', cx: 50, cy: 26, r: 12, ropeDir: 'both' },
] }) as any[];
check('pulley validates + keeps ropeDir', !!pulley && pulley[0].type === 'pulley' && pulley[0].ropeDir === 'both');
check('pulley r clamped to max',
  (validateSketch({ primitives: [{ type: 'pulley', cx: 50, cy: 50, r: 999 }] }) as any[])[0].r === SKETCH_BOUNDS.maxPulleyRadius);
check('pulley bad ropeDir dropped to undefined',
  (validateSketch({ primitives: [{ type: 'pulley', cx: 50, cy: 50, r: 12, ropeDir: 'up' }] }) as any[])[0].ropeDir === undefined);
check('pulley coords clamp into 0..100',
  (validateSketch({ primitives: [{ type: 'pulley', cx: -9, cy: 50, r: 12 }] }) as any[])[0].cx === 0);
check('pulley r<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'pulley', cx: 50, cy: 50, r: 0 }] }) === null);
check('pulley missing r dropped → null',
  validateSketch({ primitives: [{ type: 'pulley', cx: 50, cy: 50 }] }) === null);

// ── lever primitive (Wave 3) ──
const lever = validateSketch({ primitives: [
  { type: 'lever', x: 50, y: 56, length: 76, pivotFrac: 0.5, tilt: 10 },
] }) as any[];
check('lever validates + keeps tilt', !!lever && lever[0].type === 'lever' && lever[0].tilt === 10);
check('lever length clamped to max',
  (validateSketch({ primitives: [{ type: 'lever', x: 50, y: 50, length: 999, pivotFrac: 0.5 }] }) as any[])[0].length === SKETCH_BOUNDS.maxLeverLength);
check('lever pivotFrac clamped to 0..1',
  (validateSketch({ primitives: [{ type: 'lever', x: 50, y: 50, length: 40, pivotFrac: 5 }] }) as any[])[0].pivotFrac === 1);
check('lever negative pivotFrac clamped to 0',
  (validateSketch({ primitives: [{ type: 'lever', x: 50, y: 50, length: 40, pivotFrac: -3 }] }) as any[])[0].pivotFrac === 0);
check('lever tilt clamped to +max',
  (validateSketch({ primitives: [{ type: 'lever', x: 50, y: 50, length: 40, pivotFrac: 0.5, tilt: 999 }] }) as any[])[0].tilt === SKETCH_BOUNDS.maxLeverTilt);
check('lever tilt clamped to -max',
  (validateSketch({ primitives: [{ type: 'lever', x: 50, y: 50, length: 40, pivotFrac: 0.5, tilt: -999 }] }) as any[])[0].tilt === -SKETCH_BOUNDS.maxLeverTilt);
check('lever length<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'lever', x: 50, y: 50, length: 0, pivotFrac: 0.5 }] }) === null);
check('lever missing pivotFrac dropped → null',
  validateSketch({ primitives: [{ type: 'lever', x: 50, y: 50, length: 40 }] }) === null);

// ── gauge primitive (Wave 3) ──
const gauge = validateSketch({ primitives: [
  { type: 'gauge', cx: 50, cy: 62, r: 34, frac: 0.7, label: 'speed' },
] }) as any[];
check('gauge validates + keeps label', !!gauge && gauge[0].type === 'gauge' && gauge[0].frac === 0.7 && gauge[0].label === 'speed');
check('gauge r clamped to max',
  (validateSketch({ primitives: [{ type: 'gauge', cx: 50, cy: 50, r: 999, frac: 0.5 }] }) as any[])[0].r === SKETCH_BOUNDS.maxGaugeRadius);
check('gauge frac clamped to 0..1',
  (validateSketch({ primitives: [{ type: 'gauge', cx: 50, cy: 50, r: 30, frac: 9 }] }) as any[])[0].frac === 1);
check('gauge negative frac clamped to 0',
  (validateSketch({ primitives: [{ type: 'gauge', cx: 50, cy: 50, r: 30, frac: -2 }] }) as any[])[0].frac === 0);
check('gauge empty label dropped to undefined',
  (validateSketch({ primitives: [{ type: 'gauge', cx: 50, cy: 50, r: 30, frac: 0.5, label: '   ' }] }) as any[])[0].label === undefined);
check('gauge r<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'gauge', cx: 50, cy: 50, r: 0, frac: 0.5 }] }) === null);
check('gauge missing frac dropped → null',
  validateSketch({ primitives: [{ type: 'gauge', cx: 50, cy: 50, r: 30 }] }) === null);

// ── axis primitive (Wave 3) ──
const axis = validateSketch({ primitives: [
  { type: 'axis', x1: 10, y1: 46, x2: 90, y2: 46, ticks: 11, labels: ['0', '5', '10'] },
] }) as any[];
check('axis validates + keeps ticks/labels', !!axis && axis[0].type === 'axis' && axis[0].ticks === 11 && axis[0].labels.length === 3);
check('axis ticks clamped to max',
  (validateSketch({ primitives: [{ type: 'axis', x1: 10, y1: 50, x2: 90, y2: 50, ticks: 99 }] }) as any[])[0].ticks === SKETCH_BOUNDS.maxAxisTicks);
check('axis ticks clamped to min',
  (validateSketch({ primitives: [{ type: 'axis', x1: 10, y1: 50, x2: 90, y2: 50, ticks: 0 }] }) as any[])[0].ticks === SKETCH_BOUNDS.minAxisTicks);
check('axis ticks rounded',
  (validateSketch({ primitives: [{ type: 'axis', x1: 10, y1: 50, x2: 90, y2: 50, ticks: 5.7 }] }) as any[])[0].ticks === 6);
check('axis labels capped to maxAxisLabels',
  (validateSketch({ primitives: [{ type: 'axis', x1: 10, y1: 50, x2: 90, y2: 50, labels: Array.from({ length: 40 }, (_, i) => `${i}`) }] }) as any[])[0].labels.length === SKETCH_BOUNDS.maxAxisLabels);
check('axis non-string labels filtered out',
  (validateSketch({ primitives: [{ type: 'axis', x1: 10, y1: 50, x2: 90, y2: 50, labels: ['a', 5, null, 'b'] }] }) as any[])[0].labels.length === 2);
check('axis coords clamp into 0..100',
  (validateSketch({ primitives: [{ type: 'axis', x1: -9, y1: 50, x2: 9999, y2: 50 }] }) as any[])[0].x2 === 100);
check('axis zero-length dropped → null',
  validateSketch({ primitives: [{ type: 'axis', x1: 40, y1: 50, x2: 40, y2: 50 }] }) === null);
check('axis missing endpoint dropped → null',
  validateSketch({ primitives: [{ type: 'axis', x1: 40, y1: 50, x2: 60 }] }) === null);

// ── coordinate_grid primitive (Wave 4) ──
const cgrid = validateSketch({ primitives: [
  { type: 'coordinate_grid', x: 20, y: 16, w: 60, h: 60, quadrants: 4, xLabel: 'x', yLabel: 'y' },
] }) as any[];
check('coordinate_grid validates + keeps quadrants/labels',
  !!cgrid && cgrid[0].type === 'coordinate_grid' && cgrid[0].quadrants === 4 && cgrid[0].xLabel === 'x' && cgrid[0].yLabel === 'y');
check('coordinate_grid defaults quadrants to 4',
  (validateSketch({ primitives: [{ type: 'coordinate_grid', x: 10, y: 10, w: 40, h: 40 }] }) as any[])[0].quadrants === 4);
check('coordinate_grid keeps quadrants 1',
  (validateSketch({ primitives: [{ type: 'coordinate_grid', x: 10, y: 10, w: 40, h: 40, quadrants: 1 }] }) as any[])[0].quadrants === 1);
check('coordinate_grid bad quadrants coerced to 4',
  (validateSketch({ primitives: [{ type: 'coordinate_grid', x: 10, y: 10, w: 40, h: 40, quadrants: 3 }] }) as any[])[0].quadrants === 4);
check('coordinate_grid coords clamp into 0..100',
  (validateSketch({ primitives: [{ type: 'coordinate_grid', x: -9, y: 10, w: 40, h: 40 }] }) as any[])[0].x === 0);
check('coordinate_grid w<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'coordinate_grid', x: 10, y: 10, w: 0, h: 40 }] }) === null);
check('coordinate_grid missing h dropped → null',
  validateSketch({ primitives: [{ type: 'coordinate_grid', x: 10, y: 10, w: 40 }] }) === null);

// ── orbit primitive (Wave 4) ──
const orbit = validateSketch({ primitives: [
  { type: 'orbit', cx: 50, cy: 50, rx: 33, ry: 20, angle: -35, centerLabel: 'sun', satelliteLabel: 'planet' },
] }) as any[];
check('orbit validates + keeps angle/labels',
  !!orbit && orbit[0].type === 'orbit' && orbit[0].angle === -35 && orbit[0].centerLabel === 'sun' && orbit[0].satelliteLabel === 'planet');
check('orbit rx clamped to max',
  (validateSketch({ primitives: [{ type: 'orbit', cx: 50, cy: 50, rx: 999, ry: 20 }] }) as any[])[0].rx === SKETCH_BOUNDS.maxCoord);
check('orbit empty label dropped to undefined',
  (validateSketch({ primitives: [{ type: 'orbit', cx: 50, cy: 50, rx: 30, ry: 20, centerLabel: '   ' }] }) as any[])[0].centerLabel === undefined);
check('orbit coords clamp into 0..100',
  (validateSketch({ primitives: [{ type: 'orbit', cx: -9, cy: 50, rx: 30, ry: 20 }] }) as any[])[0].cx === 0);
check('orbit rx<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'orbit', cx: 50, cy: 50, rx: 0, ry: 20 }] }) === null);
check('orbit missing ry dropped → null',
  validateSketch({ primitives: [{ type: 'orbit', cx: 50, cy: 50, rx: 30 }] }) === null);

// ── molecule primitive (Wave 4) ──
const mol = validateSketch({ primitives: [
  { type: 'molecule',
    atoms: [{ x: 50, y: 46, label: 'O' }, { x: 36, y: 62, label: 'H' }, { x: 64, y: 62, label: 'H' }],
    bonds: [{ a: 0, b: 1, order: 1 }, { a: 0, b: 2, order: 2 }] },
] }) as any[];
check('molecule validates + keeps atoms/bonds',
  !!mol && mol[0].type === 'molecule' && mol[0].atoms.length === 3 && mol[0].bonds.length === 2 && mol[0].atoms[0].label === 'O');
check('molecule bond order defaults to 1',
  (validateSketch({ primitives: [{ type: 'molecule', atoms: [{ x: 20, y: 20 }, { x: 40, y: 40 }], bonds: [{ a: 0, b: 1 }] }] }) as any[])[0].bonds[0].order === 1);
check('molecule bond order clamped to 3',
  (validateSketch({ primitives: [{ type: 'molecule', atoms: [{ x: 20, y: 20 }, { x: 40, y: 40 }], bonds: [{ a: 0, b: 1, order: 9 }] }] }) as any[])[0].bonds[0].order === 3);
check('molecule out-of-range bond dropped',
  (validateSketch({ primitives: [{ type: 'molecule', atoms: [{ x: 20, y: 20 }, { x: 40, y: 40 }], bonds: [{ a: 0, b: 5 }] }] }) as any[])[0].bonds.length === 0);
check('molecule self-bond dropped',
  (validateSketch({ primitives: [{ type: 'molecule', atoms: [{ x: 20, y: 20 }, { x: 40, y: 40 }], bonds: [{ a: 1, b: 1 }] }] }) as any[])[0].bonds.length === 0);
check('molecule atom coords clamp into 0..100',
  (validateSketch({ primitives: [{ type: 'molecule', atoms: [{ x: -9, y: 20 }, { x: 40, y: 40 }], bonds: [] }] }) as any[])[0].atoms[0].x === 0);
check('molecule atoms capped at maxMoleculeAtoms',
  (validateSketch({ primitives: [{ type: 'molecule', atoms: Array.from({ length: 30 }, (_, i) => ({ x: i, y: i })), bonds: [] }] }) as any[])[0].atoms.length === SKETCH_BOUNDS.maxMoleculeAtoms);
check('molecule with no atoms dropped → null',
  validateSketch({ primitives: [{ type: 'molecule', atoms: [], bonds: [] }] }) === null);
check('molecule missing atoms/bonds arrays dropped → null',
  validateSketch({ primitives: [{ type: 'molecule', atoms: [{ x: 20, y: 20 }] }] }) === null);

// ── bar_compare primitive (Wave 4) ──
const bars = validateSketch({ primitives: [
  { type: 'bar_compare', x: 20, y: 24, w: 60, h: 50, values: [3, 7, 5], labels: ['A', 'B', 'C'] },
] }) as any[];
check('bar_compare validates + keeps values/labels',
  !!bars && bars[0].type === 'bar_compare' && bars[0].values.length === 3 && bars[0].labels.length === 3);
check('bar_compare non-number values filtered out',
  (validateSketch({ primitives: [{ type: 'bar_compare', x: 20, y: 24, w: 60, h: 50, values: [3, 'x', null, 5] }] }) as any[])[0].values.length === 2);
check('bar_compare values capped at maxBars',
  (validateSketch({ primitives: [{ type: 'bar_compare', x: 20, y: 24, w: 60, h: 50, values: Array.from({ length: 30 }, (_, i) => i + 1) }] }) as any[])[0].values.length === SKETCH_BOUNDS.maxBars);
check('bar_compare coords clamp into 0..100',
  (validateSketch({ primitives: [{ type: 'bar_compare', x: -9, y: 24, w: 60, h: 50, values: [1, 2] }] }) as any[])[0].x === 0);
check('bar_compare all-nonpositive values dropped → null',
  validateSketch({ primitives: [{ type: 'bar_compare', x: 20, y: 24, w: 60, h: 50, values: [0, -3] }] }) === null);
check('bar_compare empty values dropped → null',
  validateSketch({ primitives: [{ type: 'bar_compare', x: 20, y: 24, w: 60, h: 50, values: [] }] }) === null);
check('bar_compare w<=0 dropped → null',
  validateSketch({ primitives: [{ type: 'bar_compare', x: 20, y: 24, w: 0, h: 50, values: [3, 7] }] }) === null);

// ── new exemplars survive validation ──
for (const [name, prims] of [
  ['SPRING_MASS', SPRING_MASS], ['TRANSVERSE_WAVE', TRANSVERSE_WAVE],
  ['SKIER', SKIER], ['BEAKER_HALF', BEAKER_HALF],
  ['TORQUE', TORQUE], ['TEN_FRAME', TEN_FRAME], ['WAVELENGTH_BRACE', WAVELENGTH_BRACE],
  ['PENDULUM', PENDULUM], ['GAS_CLOUD', GAS_CLOUD], ['MOLECULES_BOX', MOLECULES_BOX],
  ['PULLEY_LIFT', PULLEY_LIFT], ['LEVER_BALANCE', LEVER_BALANCE],
  ['SPEEDOMETER', SPEEDOMETER], ['NUMBER_LINE', NUMBER_LINE],
  ['PLOT_POINT', PLOT_POINT], ['PLANET_ORBIT', PLANET_ORBIT],
  ['WATER_MOLECULE', WATER_MOLECULE], ['BAR_HEIGHTS', BAR_HEIGHTS],
] as const) {
  const v = validateSketch({ primitives: prims });
  check(`${name} validates`, !!v && v.length === prims.length, JSON.stringify(v?.length));
}

console.log(`\n${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
