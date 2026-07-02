/**
 * Hand-authored reference doodles. Two jobs:
 *   1. visual smoke for SketchRenderer (Phase 0);
 *   2. few-shot seeds for the doodler prompt (Phase 1) — these are the two
 *      analogies that started the whole initiative (ball-on-hill, glass-shatter).
 *
 * Coordinates: square 0..100, +y down. Keep these GOOD — they teach the doodler
 * the house style (a few rough strokes + a couple of labels, not a busy diagram).
 */
import type { SketchPrimitive } from './sketch-schema';

export const BALL_ON_HILL: SketchPrimitive[] = [
  // downhill slope (left-high → right-low)
  { type: 'curve', points: [
    { x: 12, y: 34 }, { x: 32, y: 44 }, { x: 52, y: 60 }, { x: 72, y: 71 }, { x: 90, y: 76 },
  ], stroke: 'ink', strokeWidth: 1.2 },
  // ground line
  { type: 'line', x1: 8, y1: 80, x2: 94, y2: 80, stroke: 'gray', strokeWidth: 0.8 },
  // the ball near the top of the slope
  { type: 'ellipse', cx: 18, cy: 28, rx: 5, ry: 5, stroke: 'amber', fill: 'amber' },
  // motion: rolling down
  { type: 'arrow', x1: 28, y1: 34, x2: 60, y2: 60, stroke: 'red', strokeWidth: 1.2 },
  { type: 'label', x: 20, y: 16, text: 'high energy', fontSize: 5, stroke: 'red', anchor: 'middle' },
  { type: 'label', x: 84, y: 90, text: 'stable / low', fontSize: 5, stroke: 'green', anchor: 'middle' },
];

export const GLASS_SHATTER: SketchPrimitive[] = [
  // before: one intact glass (a tapered tumbler)
  { type: 'polygon', points: [
    { x: 16, y: 30 }, { x: 30, y: 30 }, { x: 28, y: 58 }, { x: 18, y: 58 },
  ], stroke: 'blue', strokeWidth: 1.2 },
  { type: 'label', x: 23, y: 70, text: '1 ordered', fontSize: 5, stroke: 'ink', anchor: 'middle' },
  // the change
  { type: 'arrow', x1: 38, y1: 44, x2: 54, y2: 44, stroke: 'ink', strokeWidth: 1.2 },
  // after: scattered fragments
  { type: 'polygon', points: [{ x: 62, y: 40 }, { x: 68, y: 44 }, { x: 63, y: 48 }], stroke: 'blue' },
  { type: 'polygon', points: [{ x: 74, y: 36 }, { x: 80, y: 41 }, { x: 73, y: 43 }], stroke: 'blue' },
  { type: 'polygon', points: [{ x: 84, y: 46 }, { x: 90, y: 50 }, { x: 83, y: 52 }], stroke: 'blue' },
  { type: 'polygon', points: [{ x: 68, y: 54 }, { x: 75, y: 57 }, { x: 67, y: 60 }], stroke: 'blue' },
  { type: 'line', x1: 88, y1: 58, x2: 92, y2: 62, stroke: 'blue' },
  { type: 'label', x: 78, y: 70, text: 'many disordered', fontSize: 5, stroke: 'ink', anchor: 'middle' },
  { type: 'label', x: 78, y: 22, text: 'ΔS > 0', fontSize: 5.5, stroke: 'green', anchor: 'middle' },
];

// MOTION exemplar — teaches: ONE object at start + arrow + ONE aligned copy at
// end, never a scatter of copies. (Fixes the "three balls" failure, 2026-06-23.)
export const FALLING_BALL: SketchPrimitive[] = [
  { type: 'line', x1: 12, y1: 22, x2: 40, y2: 22, stroke: 'gray', strokeWidth: 0.8 }, // shelf / top
  { type: 'ellipse', cx: 26, cy: 28, rx: 4.5, ry: 4.5, stroke: 'amber', fill: 'amber' }, // start (top)
  { type: 'arrow', x1: 26, y1: 36, x2: 26, y2: 72, stroke: 'red', strokeWidth: 1.2 }, // falls straight down (aligned)
  { type: 'ellipse', cx: 26, cy: 80, rx: 4.5, ry: 4.5, stroke: 'amber', fill: 'amber' }, // end (bottom, same x)
  { type: 'line', x1: 10, y1: 88, x2: 92, y2: 88, stroke: 'gray', strokeWidth: 0.8 }, // ground
  { type: 'label', x: 42, y: 28, text: 'PE max, KE 0', fontSize: 5, stroke: 'green', anchor: 'start' },
  { type: 'label', x: 42, y: 80, text: 'KE max, PE 0', fontSize: 5, stroke: 'red', anchor: 'start' },
];

// SHARP-STEPS exemplar — teaches: a staircase = clean square steps from straight
// segments, not a smoothed/tangled curve. (Fixes the staircase tangle, 2026-06-23.)
export const STAIRCASE: SketchPrimitive[] = [
  { type: 'line', x1: 14, y1: 30, x2: 32, y2: 30, stroke: 'ink', strokeWidth: 1.2 },
  { type: 'line', x1: 32, y1: 30, x2: 32, y2: 46, stroke: 'ink', strokeWidth: 1.2 },
  { type: 'line', x1: 32, y1: 46, x2: 50, y2: 46, stroke: 'ink', strokeWidth: 1.2 },
  { type: 'line', x1: 50, y1: 46, x2: 50, y2: 62, stroke: 'ink', strokeWidth: 1.2 },
  { type: 'line', x1: 50, y1: 62, x2: 68, y2: 62, stroke: 'ink', strokeWidth: 1.2 },
  { type: 'line', x1: 68, y1: 62, x2: 68, y2: 78, stroke: 'ink', strokeWidth: 1.2 },
  { type: 'line', x1: 68, y1: 78, x2: 86, y2: 78, stroke: 'ink', strokeWidth: 1.2 },
  { type: 'arrow', x1: 22, y1: 24, x2: 80, y2: 72, stroke: 'red', strokeWidth: 1.2 }, // current flows down the steps
  { type: 'label', x: 12, y: 22, text: 'high V', fontSize: 5, stroke: 'green', anchor: 'start' },
  { type: 'label', x: 72, y: 86, text: 'low V', fontSize: 5, stroke: 'blue', anchor: 'start' },
];

// WAVEFRONTS exemplar — teaches: use ONE `concentric` primitive for wavefronts /
// ripples / a moving-source (Doppler) pattern, never a hand-placed pile of
// circles. squeeze bunches the rings ahead and spreads them behind; a small
// filled dot marks the source. (Fixes the Doppler blob, 2026-07-01.)
export const DOPPLER: SketchPrimitive[] = [
  // the wavefronts: rings that bunch to the right (ahead) and spread to the left
  { type: 'concentric', cx: 45, cy: 50, count: 4, spacing: 6.5, squeeze: 0.5, angle: 0, stroke: 'blue', strokeWidth: 1.1 },
  // the moving source
  { type: 'ellipse', cx: 45, cy: 50, rx: 3, ry: 3, stroke: 'red', fill: 'red' },
  // its motion (to the right, toward the compressed side)
  { type: 'arrow', x1: 49, y1: 50, x2: 64, y2: 50, stroke: 'red', strokeWidth: 1.2 },
  { type: 'label', x: 80, y: 50, text: 'high pitch', fontSize: 5, stroke: 'red', anchor: 'middle' },
  { type: 'label', x: 14, y: 14, text: 'low pitch', fontSize: 5, stroke: 'green', anchor: 'start' },
  { type: 'label', x: 45, y: 88, text: 'moving source', fontSize: 5, stroke: 'ink', anchor: 'middle' },
];

// SPRING exemplar — teaches: use ONE `spring` primitive for a coil / helix,
// never a hand-drawn zig-zag pile. A mass hangs from a vertical spring; arrows
// show it oscillating. (Fixes the scribbled-coil failure.)
export const SPRING_MASS: SketchPrimitive[] = [
  { type: 'line', x1: 26, y1: 14, x2: 74, y2: 14, stroke: 'gray', strokeWidth: 1 }, // ceiling
  { type: 'spring', x1: 50, y1: 14, x2: 50, y2: 58, coils: 6, width: 6, stroke: 'ink', strokeWidth: 1.1 },
  { type: 'rect', x: 40, y: 58, w: 20, h: 16, stroke: 'blue', fill: 'blue' }, // the mass
  { type: 'arrow', x1: 78, y1: 50, x2: 78, y2: 66, stroke: 'red', strokeWidth: 1.1 }, // down
  { type: 'arrow', x1: 86, y1: 66, x2: 86, y2: 50, stroke: 'green', strokeWidth: 1.1 }, // up
  { type: 'label', x: 50, y: 66, text: 'mass', fontSize: 5, stroke: 'ink', anchor: 'middle' },
  { type: 'label', x: 82, y: 82, text: 'oscillates', fontSize: 5, stroke: 'red', anchor: 'middle' },
];

// WAVE exemplar — teaches: use ONE `wave` primitive for a transverse/traveling
// wave, never a hand-placed wobbly curve. Amplitude + wavelength labels + a
// propagation arrow. (Fixes the scribbled-sine failure.)
export const TRANSVERSE_WAVE: SketchPrimitive[] = [
  { type: 'line', x1: 10, y1: 50, x2: 90, y2: 50, stroke: 'gray', strokeWidth: 0.7 }, // equilibrium axis
  { type: 'wave', x1: 10, y1: 50, x2: 90, y2: 50, cycles: 3, amplitude: 14, stroke: 'blue', strokeWidth: 1.3 },
  { type: 'arrow', x1: 38, y1: 80, x2: 70, y2: 80, stroke: 'ink', strokeWidth: 1.1 }, // travels right
  { type: 'label', x: 17, y: 28, text: 'amplitude', fontSize: 5, stroke: 'green', anchor: 'middle' },
  { type: 'label', x: 54, y: 88, text: 'wavelength', fontSize: 5, stroke: 'ink', anchor: 'middle' },
];

// STICK-FIGURE exemplar — teaches: use ONE `stick_figure` primitive for a
// person (a skier, runner, observer), never a NULL/abstain or a scribbled body.
// The figure rides a downhill slope with a motion arrow. (Fixes people NULLing.)
export const SKIER: SketchPrimitive[] = [
  { type: 'curve', points: [
    { x: 8, y: 34 }, { x: 32, y: 46 }, { x: 58, y: 62 }, { x: 86, y: 74 },
  ], stroke: 'ink', strokeWidth: 1.2 }, // the slope
  { type: 'line', x1: 6, y1: 86, x2: 94, y2: 86, stroke: 'gray', strokeWidth: 0.8 }, // ground
  { type: 'stick_figure', x: 40, y: 40, scale: 26, pose: 'run', stroke: 'blue', strokeWidth: 1.3 },
  { type: 'arrow', x1: 52, y1: 54, x2: 76, y2: 70, stroke: 'red', strokeWidth: 1.2 }, // speeding downhill
  { type: 'label', x: 24, y: 22, text: 'skier', fontSize: 5, stroke: 'blue', anchor: 'middle' },
  { type: 'label', x: 80, y: 84, text: 'downhill', fontSize: 5, stroke: 'red', anchor: 'middle' },
];

// CONTAINER exemplar — teaches: use ONE `container_fill` primitive for a filled
// vessel (a beaker, tank, battery, thermometer), never a rect + hand-drawn
// liquid. A beaker half full of water. (Fixes the messy-fill failure.)
export const BEAKER_HALF: SketchPrimitive[] = [
  { type: 'container_fill', x: 36, y: 26, w: 28, h: 46, fillFrac: 0.5, shape: 'beaker', fillColor: 'blue', stroke: 'ink', strokeWidth: 1.2 },
  { type: 'label', x: 50, y: 60, text: 'water', fontSize: 5, stroke: 'blue', anchor: 'middle' },
  { type: 'label', x: 50, y: 84, text: 'half full', fontSize: 5, stroke: 'ink', anchor: 'middle' },
];

export interface SketchFewshot {
  concept: string;
  labels: string[];
  primitives: SketchPrimitive[];
}

export const SKETCH_FEWSHOT: SketchFewshot[] = [
  {
    concept: 'a ball rolling down a hill toward its lowest, most stable resting point',
    labels: ['high energy', 'stable / low'],
    primitives: BALL_ON_HILL,
  },
  {
    concept: 'a glass shattering: one intact glass becomes many scattered fragments',
    labels: ['1 ordered', 'many disordered', 'ΔS > 0'],
    primitives: GLASS_SHATTER,
  },
  {
    concept: 'a ball falling from a height — potential energy at the top converts to kinetic energy at the bottom',
    labels: ['PE max, KE 0', 'KE max, PE 0'],
    primitives: FALLING_BALL,
  },
  {
    concept: 'a staircase where each step is a drop in voltage, current flowing down from high to low',
    labels: ['high V', 'low V'],
    primitives: STAIRCASE,
  },
  {
    concept:
      'the Doppler effect: a sound source moving right, wavefronts compressed ahead (higher pitch) and stretched behind (lower pitch)',
    labels: ['high pitch', 'low pitch', 'moving source'],
    primitives: DOPPLER,
  },
  {
    concept: 'a mass hanging from a spring, bouncing up and down (simple harmonic motion)',
    labels: ['mass', 'oscillates'],
    primitives: SPRING_MASS,
  },
  {
    concept: 'a transverse wave traveling along a string, showing its amplitude and wavelength',
    labels: ['amplitude', 'wavelength'],
    primitives: TRANSVERSE_WAVE,
  },
  {
    concept: 'a skier speeding down a snowy slope',
    labels: ['skier', 'downhill'],
    primitives: SKIER,
  },
  {
    concept: 'a beaker about half full of water',
    labels: ['water', 'half full'],
    primitives: BEAKER_HALF,
  },
];
