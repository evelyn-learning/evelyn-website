/**
 * Sketch primitive schema — the constrained drawing vocabulary the doodler
 * sub-model emits and the SketchRenderer draws (hand-drawn, via rough.js).
 *
 * This is the SINGLE source of truth shared by three consumers:
 *   1. the doodler route (api/tutor/sketch) — SKETCH_TOOL_SCHEMA is the forced
 *      structured-output schema Haiku must fill;
 *   2. the validator (sketch-validate.ts) — the structural quality gate;
 *   3. the renderer (SketchRenderer.tsx) — draws the primitives with rough.js.
 *
 * Design (grilled 2026-06-22, see memory project_tutor_sketch_capability):
 * the MAIN brain never authors these — it emits show_sketch({concept,labels,title})
 * and a dedicated Haiku doodler turns that into this primitive list. So the
 * spatial-reasoning burden lands on a model whose only job is drawing, and the
 * output flows through the existing whiteboard SVG pipeline.
 *
 * Coordinate space: a square 0..100 logical canvas. (0,0) = top-left,
 * (100,100) = bottom-right; +y points DOWN (SVG convention). A square space
 * (not the 520×360 diagram viewBox) keeps circles round and is the natural
 * mental model for "a ball on a hill". feat() normalization uses {100,100}.
 */

/** The logical drawing canvas — square, 0..100 in both axes. */
export const SKETCH_VIEWBOX = { width: 100, height: 100 } as const;

/**
 * Named semantic palette. The doodler picks a token (not raw hex) so colors
 * stay consistent + on-theme and we never render garbage color strings.
 */
export const SKETCH_COLORS = {
  ink: '#1f2937', // default stroke — near-black
  red: '#dc2626',
  blue: '#2563eb',
  green: '#16a34a',
  amber: '#d97706',
  gray: '#9ca3af',
} as const;
export type SketchColor = keyof typeof SKETCH_COLORS;
export const SKETCH_COLOR_NAMES = Object.keys(SKETCH_COLORS) as SketchColor[];

/** Structural bounds — the quality gate. Shared with sketch-validate.ts. */
export const SKETCH_BOUNDS = {
  maxPrimitives: 30,
  minPrimitives: 1,
  maxPolyPoints: 40,
  minPolyPoints: 2,
  maxLabels: 10,
  maxLabelLen: 40,
  minCoord: 0,
  maxCoord: 100,
  maxStrokeWidth: 4,
  minConcentricCount: 2,
  maxConcentricCount: 8,
  // wave: a transverse sine along a segment
  minWaveCycles: 0.5,
  maxWaveCycles: 12,
  maxAmplitude: 40,
  // spring: a zig-zag coil between two points
  minCoils: 1,
  maxCoils: 14,
  maxSpringWidth: 30,
  // stick_figure: a simple person of the given pixel height
  minStickScale: 8,
  maxStickScale: 90,
  // grid: a regular cols×rows grid (one primitive draws the whole grid)
  minGridDim: 1,
  maxGridDim: 24,
  // arc: a single open arc, radius in canvas units
  maxArcRadius: 70,
  // blob: an organic wobbly closed loop; wobble = fraction of the radius
  maxBlobWobble: 0.6,
  // dots_cluster: N scattered dots within `spread` of the center
  maxDotsCount: 80,
  maxSpread: 48,
} as const;

export interface Pt {
  x: number;
  y: number;
}

interface Styled {
  /** Stroke color token (default 'ink'). */
  stroke?: SketchColor;
  /** Fill color token, or omit/'none' for unfilled. */
  fill?: SketchColor;
  /** Stroke weight, 1..maxStrokeWidth (default ~1.5). */
  strokeWidth?: number;
}

export type SketchPrimitive =
  | ({ type: 'line'; x1: number; y1: number; x2: number; y2: number } & Styled)
  | ({ type: 'arrow'; x1: number; y1: number; x2: number; y2: number } & Styled)
  | ({ type: 'curve'; points: Pt[]; closed?: boolean } & Styled)
  | ({ type: 'ellipse'; cx: number; cy: number; rx: number; ry: number } & Styled)
  | ({ type: 'rect'; x: number; y: number; w: number; h: number; rounded?: boolean } & Styled)
  | ({ type: 'polygon'; points: Pt[] } & Styled)
  // Parametric composite: a nest of `count` concentric circles around (cx,cy),
  // radii = spacing, 2·spacing, …. `squeeze` (0..0.9) shifts each larger circle's
  // center back along `angle` so the rings BUNCH ahead and SPREAD behind — the
  // canonical moving-source wavefront (Doppler) picture. squeeze 0 = even ripples
  // / a radial field. angle in degrees, 0 = motion to the right (+x). The doodler
  // emits ONE of these instead of hand-placing a pile of wobbly ellipses.
  | ({
      type: 'concentric';
      cx: number;
      cy: number;
      count: number;
      spacing: number;
      squeeze?: number;
      angle?: number;
    } & Styled)
  // Parametric: a transverse sine wave along the segment (x1,y1)→(x2,y2).
  // `cycles` = number of full waves; `amplitude` = perpendicular swing in canvas
  // units; `damping` 0..1 tapers the amplitude toward the far end (a decaying
  // wave). Our code samples the sine, so the doodler never hand-places crests.
  // Covers transverse/sound/light waves, oscillation, AC, a wave on a string.
  | ({
      type: 'wave';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      cycles: number;
      amplitude: number;
      damping?: number;
    } & Styled)
  // Parametric: a zig-zag helical spring between (x1,y1) and (x2,y2). `coils` =
  // number of loops; `width` = coil half-height (perpendicular). Covers a
  // Hooke/SHM spring-mass, a solenoid, an inductor, elasticity.
  | ({
      type: 'spring';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      coils: number;
      width: number;
    } & Styled)
  // Parametric: a simple recognizable stick person centered near (x,y). `scale`
  // = overall height in canvas units; `pose` varies the limb angles. Fixes the
  // doodler NULLing/abstaining on people (a skier, a runner, an observer).
  | ({
      type: 'stick_figure';
      x: number;
      y: number;
      scale: number;
      pose?: 'stand' | 'walk' | 'run' | 'point' | 'arms-up';
    } & Styled)
  // Parametric: a container outline filled with liquid from the bottom to
  // `fillFrac` (0..1). `shape` picks the outline; `fillColor` tints the liquid.
  // Covers a water tank, a beaker, battery charge, a thermometer, a level/gauge.
  | ({
      type: 'container_fill';
      x: number;
      y: number;
      w: number;
      h: number;
      fillFrac: number;
      shape?: 'beaker' | 'tank' | 'battery' | 'thermometer';
      fillColor?: SketchColor;
    } & Styled)
  // Parametric: an arrow along (x1,y1)→(x2,y2) with a head STYLE — `single` a
  // plain open head; `double` heads at BOTH ends (equilibrium, a span); `curved`
  // an arc arrow that bulges to one side (rotation, a cycle, "goes around");
  // `block` a solid filled triangle head (a bold force/vector). Optional `label`
  // rides the midpoint. Covers forces, torque, cycles, equilibrium, reversible
  // reactions — richer than the plain `arrow` primitive.
  | ({
      type: 'vector';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      style?: 'single' | 'double' | 'curved' | 'block';
      label?: string;
    } & Styled)
  // Parametric: a regular cols×rows grid whose top-left cell corner is (x,y) and
  // whose cells are `cell` units square. `style` = lines (rules), dots (a dot at
  // each intersection) or boxes (each cell outlined). `fillCount` drops a filled
  // counter dot into the first N cells (row-major) — a ten-frame, an array, a
  // coordinate backdrop. ONE primitive draws the whole grid.
  | ({
      type: 'grid';
      x: number;
      y: number;
      cols: number;
      rows: number;
      cell: number;
      style?: 'lines' | 'dots' | 'boxes';
      fillCount?: number;
    } & Styled)
  // Parametric: a curly brace spanning (x1,y1)→(x2,y2), bulging (and pointing its
  // label) toward `side`. Optional `label` sits at the brace tip. Covers "this
  // span = …", a measurement, grouping a set of items.
  | ({
      type: 'brace';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      side?: 'left' | 'right' | 'top' | 'bottom';
      label?: string;
    } & Styled)
  // Parametric: a single OPEN arc — center (cx,cy), radius r, from `startAngle`
  // to `endAngle` (degrees, 0 = +x / right, growing clockwise since +y is down).
  // Covers a pendulum swing, an orbit segment, an angle mark. (concentric already
  // draws closed rings; this is the open sweep.)
  | ({
      type: 'arc';
      cx: number;
      cy: number;
      r: number;
      startAngle: number;
      endAngle: number;
    } & Styled)
  // Parametric: an organic closed WOBBLY loop around (cx,cy) with radii rx,ry and
  // an irregular edge (`wobble` 0..0.6 = how lumpy). Covers a cloud, a gas puff,
  // a region/set, an amoeba-ish shape — anything that should read as "a blob",
  // not a clean ellipse.
  | ({
      type: 'blob';
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      wobble?: number;
    } & Styled)
  // Parametric: `count` small dots scattered (deterministically) within `spread`
  // of (cx,cy). Covers a QUANTITY of like things — molecules/particles in a
  // region, a population, a scatter — without hand-placing every dot.
  | ({
      type: 'dots_cluster';
      cx: number;
      cy: number;
      count: number;
      spread: number;
    } & Styled)
  | {
      type: 'label';
      x: number;
      y: number;
      text: string;
      /** ~3..7 logical units; default 5. */
      fontSize?: number;
      anchor?: 'start' | 'middle' | 'end';
      stroke?: SketchColor;
    };

export type SketchPrimitiveType = SketchPrimitive['type'];
export const SKETCH_PRIMITIVE_TYPES: SketchPrimitiveType[] = [
  'line',
  'arrow',
  'curve',
  'ellipse',
  'rect',
  'polygon',
  'concentric',
  'wave',
  'spring',
  'stick_figure',
  'container_fill',
  'vector',
  'grid',
  'brace',
  'arc',
  'blob',
  'dots_cluster',
  'label',
];

/**
 * JSON schema for the doodler's forced structured output. Anthropic tool
 * input_schema shape: the doodler must return { primitives: SketchPrimitive[] }.
 * Kept permissive on a per-primitive basis (oneOf is brittle across models);
 * the real gate is sketch-validate.ts, which runs on the result server-side.
 */
export const SKETCH_TOOL_NAME = 'emit_sketch';
export const SKETCH_TOOL_SCHEMA = {
  type: 'object' as const,
  properties: {
    abstain: {
      type: 'boolean',
      description:
        'Set true (and OMIT primitives) when this concept cannot be conveyed by a rough freehand doodle — ' +
        'e.g. it needs precise geometry, an exact graph/curve, a 3D solid (a cone, a sliced solid), a ' +
        'detailed labeled technical/anatomical diagram, a specific real object that must be recognizable ' +
        '(a roller coaster, a car, an animal), a repeated/periodic pattern you would fake with many ' +
        'hand-placed strokes (a lattice, a grating) with no dedicated primitive for it, or accurate ' +
        'proportions. A rough doodle of those reads as a misleading blob, so it is better to draw NOTHING. ' +
        'Only doodle illustrative / intuition / analogy concepts (a ball on a hill, energy flowing, a ' +
        'simple before→after).',
    },
    abstainReason: {
      type: 'string',
      description: 'When abstaining, a short reason (e.g. "3D sliced cone needs precise geometry").',
    },
    primitives: {
      type: 'array',
      minItems: SKETCH_BOUNDS.minPrimitives,
      maxItems: SKETCH_BOUNDS.maxPrimitives,
      description:
        'Ordered list of drawing primitives on a square 0..100 canvas ((0,0)=top-left, +y down). ' +
        'Draw the concept as a teacher would doodle it: a few rough strokes plus a couple of labels. ' +
        'Earlier primitives render under later ones. Omit when abstain is true.',
      items: {
        type: 'object',
        properties: {
          type: { type: 'string', enum: SKETCH_PRIMITIVE_TYPES },
          // geometry (used per-type; validator enforces which apply)
          x1: { type: 'number' }, y1: { type: 'number' },
          x2: { type: 'number' }, y2: { type: 'number' },
          x: { type: 'number' }, y: { type: 'number' },
          w: { type: 'number' }, h: { type: 'number' },
          cx: { type: 'number' }, cy: { type: 'number' },
          rx: { type: 'number' }, ry: { type: 'number' },
          // concentric (wavefronts): count rings around (cx,cy), radii = spacing·k.
          count: { type: 'number', description: 'concentric: number of rings (2..8). dots_cluster: number of dots (1..80).' },
          spacing: { type: 'number', description: 'concentric: radius step between rings.' },
          squeeze: {
            type: 'number',
            description:
              'concentric: 0..0.9 asymmetry. 0 = even ripples / radial field; ~0.5 = strong ' +
              'moving-source compression (rings bunch ahead, spread behind — the Doppler picture).',
          },
          angle: {
            type: 'number',
            description: 'concentric: motion direction in degrees; 0 = right (default), 90 = down.',
          },
          // wave (transverse sine along x1,y1→x2,y2)
          cycles: { type: 'number', description: 'wave: number of full waves along the segment (0.5..12).' },
          amplitude: { type: 'number', description: 'wave: perpendicular swing in canvas units (e.g. 8).' },
          damping: {
            type: 'number',
            description: 'wave: 0..1, tapers amplitude toward the far end (0 = steady, ~0.7 = decaying wave).',
          },
          // spring (zig-zag coil along x1,y1→x2,y2)
          coils: { type: 'number', description: 'spring: number of loops/zig-zags (1..14).' },
          width: { type: 'number', description: 'spring: coil half-height perpendicular to the axis (e.g. 6).' },
          // stick_figure (a simple person centered at x,y)
          scale: { type: 'number', description: 'stick_figure: overall height in canvas units (e.g. 30).' },
          pose: {
            type: 'string',
            enum: ['stand', 'walk', 'run', 'point', 'arms-up'],
            description: 'stick_figure: limb pose (default stand).',
          },
          // container_fill (a container filled with liquid from the bottom)
          fillFrac: { type: 'number', description: 'container_fill: fill level 0..1 (0.5 = half full).' },
          shape: {
            type: 'string',
            enum: ['beaker', 'tank', 'battery', 'thermometer'],
            description: 'container_fill: outline shape (default plain rounded tank).',
          },
          fillColor: {
            type: 'string',
            enum: SKETCH_COLOR_NAMES,
            description: 'container_fill: liquid tint (default blue; battery→green, thermometer→red read well).',
          },
          // vector (styled arrow along x1,y1→x2,y2) — style + optional label
          style: {
            type: 'string',
            enum: ['single', 'double', 'curved', 'block', 'lines', 'dots', 'boxes'],
            description:
              'vector: head style single|double|curved|block (single=plain head, double=heads both ends for ' +
              'equilibrium, curved=arc arrow for rotation/cycles, block=solid filled head for a bold force). ' +
              'grid: layout lines|dots|boxes.',
          },
          label: {
            type: 'string',
            description: 'vector / brace: a short text tag placed at the arrow midpoint / brace tip (2–4 words).',
          },
          // grid (cols×rows of cell-sized cells, top-left at x,y)
          cols: { type: 'number', description: 'grid: number of columns (1..24).' },
          rows: { type: 'number', description: 'grid: number of rows (1..24). A ten-frame is 2 rows × 5 cols.' },
          cell: { type: 'number', description: 'grid: side length of each square cell in canvas units.' },
          fillCount: {
            type: 'number',
            description: 'grid: drop a filled counter dot into the first N cells (row-major). e.g. 7 on a ten-frame.',
          },
          // brace (curly brace spanning x1,y1→x2,y2)
          side: {
            type: 'string',
            enum: ['left', 'right', 'top', 'bottom'],
            description: 'brace: which side the brace bulges toward and where its label sits.',
          },
          // arc (open arc: center cx,cy, radius r, startAngle→endAngle in degrees)
          r: { type: 'number', description: 'arc: radius in canvas units.' },
          startAngle: { type: 'number', description: 'arc: start angle in degrees (0 = right, grows clockwise).' },
          endAngle: { type: 'number', description: 'arc: end angle in degrees.' },
          // blob (organic wobbly loop around cx,cy with radii rx,ry)
          wobble: { type: 'number', description: 'blob: edge irregularity 0..0.6 (0 = smooth ellipse, ~0.35 = lumpy).' },
          // dots_cluster (count dots scattered within spread of cx,cy)
          spread: { type: 'number', description: 'dots_cluster: scatter radius around the center in canvas units.' },
          points: {
            type: 'array',
            items: {
              type: 'object',
              properties: { x: { type: 'number' }, y: { type: 'number' } },
              required: ['x', 'y'],
            },
          },
          closed: { type: 'boolean' },
          rounded: { type: 'boolean' },
          text: { type: 'string' },
          fontSize: { type: 'number' },
          anchor: { type: 'string', enum: ['start', 'middle', 'end'] },
          stroke: { type: 'string', enum: SKETCH_COLOR_NAMES },
          fill: { type: 'string', enum: SKETCH_COLOR_NAMES },
          strokeWidth: { type: 'number' },
        },
        required: ['type'],
      },
    },
  },
  required: [],
};
