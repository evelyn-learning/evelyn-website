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
    primitives: {
      type: 'array',
      minItems: SKETCH_BOUNDS.minPrimitives,
      maxItems: SKETCH_BOUNDS.maxPrimitives,
      description:
        'Ordered list of drawing primitives on a square 0..100 canvas ((0,0)=top-left, +y down). ' +
        'Draw the concept as a teacher would doodle it: a few rough strokes plus a couple of labels. ' +
        'Earlier primitives render under later ones.',
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
  required: ['primitives'],
};
