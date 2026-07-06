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

/**
 * The fixed set of simple, rough-drawable glyphs the `icon` primitive can draw.
 * Concrete everyday objects a freehand doodle otherwise garbles (especially for
 * younger grades) — drawn deterministically so the doodler never hand-places
 * the strokes. Keep additions SIMPLE (a few strokes, instantly recognizable).
 */
export const ICON_NAMES = [
  'sun', 'moon', 'cloud', 'raindrop', 'flame', 'tree', 'leaf', 'mountain',
  'star', 'heart', 'house', 'book', 'lightbulb', 'gear', 'coin', 'magnet',
  'bolt', 'clock',
] as const;
export type IconName = (typeof ICON_NAMES)[number];

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
  // pulley: a wheel + rope draped over the top
  maxPulleyRadius: 30,
  // lever: a straight beam resting on a fulcrum
  maxLeverLength: 92,
  maxLeverTilt: 40,
  // gauge: a semicircular dial + needle
  maxGaugeRadius: 42,
  // axis: a number line / scale with evenly spaced ticks + optional labels
  minAxisTicks: 2,
  maxAxisTicks: 21,
  maxAxisLabels: 12,
  // coordinate_grid: a labeled coordinate plane (1 or 4 quadrants); the
  // gridline density is fixed in the renderer, so no numeric bound needed here.
  // molecule: a ball-and-stick doodle — atoms linked by bonds
  maxMoleculeAtoms: 12,
  maxMoleculeBonds: 16,
  // bar_compare: a mini side-by-side bar chart
  maxBars: 10,
  // cycle: labelled stages evenly spaced around a ring, joined by curved arrows
  minCycleStages: 2,
  maxCycleStages: 8,
  maxCycleRadius: 44,
  // flow_chain: ordered labelled boxes joined by arrows
  minFlowSteps: 2,
  maxFlowSteps: 6,
  // balance_scale: a two-pan scale, beam tipped by `tilt` degrees about the pivot
  maxBalanceTilt: 26,
  // icon: a glyph from ICON_NAMES at the given bounding size
  minIconSize: 6,
  maxIconSize: 60,
  // part_whole: a pie cut into `parts` equal wedges, `filled` shaded
  minParts: 2,
  maxParts: 12,
  // tree_diagram: a root with `branches` child boxes
  minBranches: 2,
  maxBranches: 5,
  // network: labelled nodes joined by edges
  maxNodes: 8,
  maxEdges: 14,
  // timeline: events marked along a line
  minEvents: 1,
  maxEvents: 6,
  // venn: two overlapping circles
  maxVennRadius: 30,
  // layers: stacked labelled bands
  minLayers: 2,
  maxLayers: 6,
  // matrix: a labelled rows×cols table
  minMatrixDim: 1,
  maxMatrixDim: 5,
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
  // Parametric: a PULLEY — a wheel (rim + hub) at (cx,cy) radius r with a rope
  // draped over the top hanging straight down each side. `ropeDir` picks which
  // side(s) the rope hangs ('both' default, or 'left'/'right' for a single load
  // line). Covers mechanical advantage, a block-and-tackle, lifting a load.
  | ({
      type: 'pulley';
      cx: number;
      cy: number;
      r: number;
      ropeDir?: 'both' | 'left' | 'right';
    } & Styled)
  // Parametric: a LEVER — a straight beam of `length` centered at (x,y) resting
  // on a triangular fulcrum at `pivotFrac` (0..1 along the beam), tipped by
  // `tilt` degrees (+ = right side down) about the pivot. Covers torque, a
  // seesaw, moments, mechanical advantage.
  | ({
      type: 'lever';
      x: number;
      y: number;
      length: number;
      pivotFrac: number;
      tilt?: number;
    } & Styled)
  // Parametric: a GAUGE — a semicircular dial at (cx,cy) radius r with tick marks
  // and a needle pointing to `frac` (0..1 across the left→right sweep). Optional
  // `label` sits under the dial. Covers a pressure/speed/level meter, "how much".
  | ({
      type: 'gauge';
      cx: number;
      cy: number;
      r: number;
      frac: number;
      label?: string;
    } & Styled)
  // Parametric: an AXIS / number-line from (x1,y1)→(x2,y2) with `ticks` evenly
  // spaced tick marks and an optional `labels` array placed under successive
  // ticks. Covers a scale, a number line, a timeline.
  | ({
      type: 'axis';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      ticks?: number;
      labels?: string[];
    } & Styled)
  // Parametric: a labeled COORDINATE PLANE filling the box (x,y = top-left; w,h).
  // `quadrants` 4 = origin centered (all four quadrants); 1 = origin at the
  // bottom-left (only the +x/+y quadrant). Light gridlines, darker axes with
  // arrowheads, and optional `xLabel`/`yLabel` axis captions. For plotting /
  // graphing doodles. ONE primitive draws the whole plane.
  | ({
      type: 'coordinate_grid';
      x: number;
      y: number;
      w: number;
      h: number;
      quadrants?: 1 | 4;
      xLabel?: string;
      yLabel?: string;
    } & Styled)
  // Parametric: an ORBIT — a filled central body at (cx,cy), an elliptical orbit
  // path (radii rx,ry), and a satellite dot placed at `angle` degrees around it
  // (0 = right, +y down). Optional `centerLabel` / `satelliteLabel`. For a
  // planet orbiting the sun, an electron, a satellite. ONE primitive.
  | ({
      type: 'orbit';
      cx: number;
      cy: number;
      rx: number;
      ry: number;
      angle?: number;
      satelliteLabel?: string;
      centerLabel?: string;
    } & Styled)
  // Parametric: a simple ball-and-stick MOLECULE — `atoms` are small labeled
  // circles at (x,y); `bonds` link two atom indices (a,b) with `order` 1|2|3
  // (single/double/triple lines). For a quick molecular doodle (H₂O, CO₂, a
  // benzene ring). ONE primitive draws every atom + bond.
  | ({
      type: 'molecule';
      atoms: { x: number; y: number; label?: string }[];
      bonds: { a: number; b: number; order?: number }[];
    } & Styled)
  // Parametric: a mini BAR CHART in the box (x,y = top-left; w,h). `values` set
  // the bar heights (scaled to the tallest); optional `labels` sit under each
  // bar. For a quick side-by-side comparison. ONE primitive draws all the bars.
  | ({
      type: 'bar_compare';
      x: number;
      y: number;
      w: number;
      h: number;
      values: number[];
      labels?: string[];
    } & Styled)
  // Parametric: a CYCLE — `stages` labels evenly spaced around a ring of radius r
  // centered at (cx,cy), joined by curved arrows going around (clockwise by
  // default). For a repeating process: the water / rock / carbon / nitrogen
  // cycle, a life cycle, a feedback loop, the business cycle. ONE primitive draws
  // the whole loop (node dots + connecting arrows + stage labels).
  | ({
      type: 'cycle';
      cx: number;
      cy: number;
      r: number;
      stages: string[];
      clockwise?: boolean;
    } & Styled)
  // Parametric: a FLOW CHAIN — `steps` labelled boxes laid out in order and joined
  // by arrows, flowing to the `direction` (right = a horizontal row, down = a
  // vertical column) from the top-left anchor (x,y). For a process / sequence /
  // pathway: a food chain, energy flow, cause→effect, digestion, a pipeline. ONE
  // primitive draws every box + arrow + step label.
  | ({
      type: 'flow_chain';
      x: number;
      y: number;
      steps: string[];
      direction?: 'right' | 'down';
    } & Styled)
  // Parametric: a two-pan BALANCE SCALE centered at the pivot (cx,cy) — a post on
  // a base, a beam tipped `tilt` degrees (+ = right side down, 0 = balanced) about
  // the pivot, and a level pan hanging from each beam end. Optional pan labels.
  // For equilibrium, a trade-off, fairness, weighing two sides (supply vs demand,
  // costs vs benefits, a balanced equation). ONE primitive draws the whole scale.
  | ({
      type: 'balance_scale';
      cx: number;
      cy: number;
      tilt?: number;
      leftLabel?: string;
      rightLabel?: string;
    } & Styled)
  // Parametric: a simple recognizable ICON glyph `name` (from ICON_NAMES) drawn
  // rough at `size` (bounding height) centered at (x,y). For a concrete everyday
  // object a freehand doodle otherwise garbles — the sun, a tree, a house, a water
  // drop, a flame — especially for younger grades. ONE primitive draws the glyph.
  | ({
      type: 'icon';
      name: IconName;
      x: number;
      y: number;
      size: number;
    } & Styled)
  // Parametric: a PART-WHOLE pie — a circle at (cx,cy) radius r cut into `parts`
  // equal wedges, the first `filled` of them shaded (with the `fill` colour token,
  // else blue). Optional `label` under it (e.g. "3/4" or "75%"). For fractions,
  // percentages, proportions, a budget share. ONE primitive draws the whole pie.
  | ({
      type: 'part_whole';
      cx: number;
      cy: number;
      r: number;
      parts: number;
      filled?: number;
      label?: string;
    } & Styled)
  // Parametric: a TREE DIAGRAM — a `root` box at the top with `branches` child
  // boxes in a row below, joined by connector lines. For a hierarchy / breakdown /
  // classification / family or decision tree / an idea splitting into parts. ONE
  // primitive draws the root, the children and the connectors.
  | ({
      type: 'tree_diagram';
      x: number;
      y: number;
      root: string;
      branches: string[];
    } & Styled)
  // Parametric: a NETWORK / concept map — labelled `nodes` (circles at (x,y)) joined
  // by `edges` (plain lines between node indices a,b). For a mind-map, a concept
  // map, relationships, a small graph. ONE primitive draws every node + edge.
  | ({
      type: 'network';
      nodes: { x: number; y: number; label?: string }[];
      edges: { a: number; b: number }[];
    } & Styled)
  // Parametric: a SPEECH BUBBLE — a rounded box (x,y = top-left; w,h) holding
  // `text`, with a tail pointing to (tailX,tailY) (default just below-left). For
  // dialogue, a character "saying" something, a quote, a callout. ONE primitive
  // draws the bubble + tail (with the text centered inside).
  | ({
      type: 'speech_bubble';
      x: number;
      y: number;
      w: number;
      h: number;
      text: string;
      tailX?: number;
      tailY?: number;
    } & Styled)
  // Parametric: a TIMELINE — a line (x1,y1)→(x2,y2) with `events` marked at
  // fractional positions `at` (0..1) and labelled alternately above/below. For a
  // sequence of dated events, a history timeline, project phases. ONE primitive
  // draws the line, the markers and the labels.
  | ({
      type: 'timeline';
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      events: { at: number; label: string }[];
    } & Styled)
  // Parametric: a 2-circle VENN diagram — two overlapping circles of radius r
  // centered around (cx,cy). `leftLabel` names what is unique to the left circle,
  // `rightLabel` what is unique to the right, and `bothLabel` what they share (in
  // the overlap). For compare/contrast, sets, shared vs unique traits, logic. ONE
  // primitive draws both circles + the three region labels.
  | ({
      type: 'venn';
      cx: number;
      cy: number;
      r: number;
      leftLabel?: string;
      rightLabel?: string;
      bothLabel?: string;
    } & Styled)
  // Parametric: stacked LAYERS — `layers` labelled horizontal bands filling the box
  // (x,y = top-left; w,h), top band = layers[0]. For strata / a layered structure:
  // the Earth's layers, the atmosphere, rock strata, a hierarchy of levels. ONE
  // primitive draws every band + its label.
  | ({
      type: 'layers';
      x: number;
      y: number;
      w: number;
      h: number;
      layers: string[];
    } & Styled)
  // Parametric: a labelled MATRIX / table — a rows×cols grid filling (x,y,w,h) with
  // optional `colLabels` (headers above the columns), `rowLabels` (left of the
  // rows) and `cells` (row-major cell text). For a 2×2 framework (SWOT), a decision
  // matrix, a Punnett square, a small comparison table. ONE primitive.
  | ({
      type: 'matrix';
      x: number;
      y: number;
      w: number;
      h: number;
      rows: number;
      cols: number;
      rowLabels?: string[];
      colLabels?: string[];
      cells?: string[];
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
  'pulley',
  'lever',
  'gauge',
  'axis',
  'coordinate_grid',
  'orbit',
  'molecule',
  'bar_compare',
  'cycle',
  'flow_chain',
  'balance_scale',
  'icon',
  'part_whole',
  'tree_diagram',
  'network',
  'speech_bubble',
  'timeline',
  'venn',
  'layers',
  'matrix',
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
            description:
              'concentric: motion direction in degrees; 0 = right (default), 90 = down. ' +
              'orbit: satellite position around the path in degrees (0 = right, 90 = down).',
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
            description: 'vector / brace / gauge: a short text tag placed at the arrow midpoint / brace tip / under the dial (2–4 words).',
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
          // pulley (wheel + rope over the top, hanging down each side)
          ropeDir: {
            type: 'string',
            enum: ['both', 'left', 'right'],
            description: 'pulley: which side(s) the rope hangs (default both; left/right = a single load line).',
          },
          // lever (beam of `length` centered at x,y on a fulcrum at pivotFrac)
          length: { type: 'number', description: 'lever: beam length in canvas units.' },
          pivotFrac: { type: 'number', description: 'lever: fulcrum position 0..1 along the beam (0.5 = center).' },
          tilt: { type: 'number', description: 'lever / balance_scale: beam tilt in degrees, + = right side down (default 0 = level).' },
          // gauge (semicircular dial + needle at frac)
          frac: { type: 'number', description: 'gauge: needle position 0..1 across the left→right sweep (0.7 = 70%).' },
          // axis (number line from x1,y1→x2,y2 with ticks + optional labels)
          ticks: { type: 'number', description: 'axis: number of evenly spaced tick marks, 2..21.' },
          labels: {
            type: 'array',
            items: { type: 'string' },
            description:
              'axis: short labels under successive ticks (e.g. ["0","5","10"]). ' +
              'bar_compare: a short caption under each bar (e.g. ["Mon","Tue","Wed"]).',
          },
          // coordinate_grid (a labeled coordinate plane filling x,y,w,h)
          quadrants: {
            type: 'number',
            enum: [1, 4],
            description: 'coordinate_grid: 4 = origin centered (all quadrants); 1 = origin bottom-left (+x/+y only). Default 4.',
          },
          xLabel: { type: 'string', description: 'coordinate_grid: caption at the x-axis (right) end, e.g. "time".' },
          yLabel: { type: 'string', description: 'coordinate_grid: caption at the y-axis (top) end, e.g. "speed".' },
          // orbit (central body + elliptical path + satellite at `angle`)
          satelliteLabel: { type: 'string', description: 'orbit: short label near the satellite dot (e.g. "planet").' },
          centerLabel: { type: 'string', description: 'orbit: short label near the central body (e.g. "sun").' },
          // molecule (ball-and-stick: atoms + bonds by index)
          atoms: {
            type: 'array',
            description: 'molecule: atoms as {x,y,label?} on the 0..100 canvas (label = element symbol, e.g. "O").',
            items: {
              type: 'object',
              properties: { x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' } },
              required: ['x', 'y'],
            },
          },
          bonds: {
            type: 'array',
            description: 'molecule: bonds linking atom indices {a,b, order?} where order 1|2|3 = single/double/triple.',
            items: {
              type: 'object',
              properties: { a: { type: 'number' }, b: { type: 'number' }, order: { type: 'number' } },
              required: ['a', 'b'],
            },
          },
          // bar_compare (a mini bar chart filling x,y,w,h)
          values: {
            type: 'array',
            items: { type: 'number' },
            description: 'bar_compare: bar magnitudes, scaled to the tallest (e.g. [3, 7, 5]).',
          },
          // cycle (labelled stages around a ring, joined by curved arrows)
          stages: {
            type: 'array',
            items: { type: 'string' },
            description: 'cycle: the stage labels in order around the loop (2..8), e.g. ["Evaporation","Condensation","Precipitation","Collection"].',
          },
          clockwise: { type: 'boolean', description: 'cycle: go clockwise (default true) or counter-clockwise.' },
          // flow_chain (ordered labelled boxes joined by arrows)
          steps: {
            type: 'array',
            items: { type: 'string' },
            description: 'flow_chain: the step labels in order (2..6), e.g. ["Sun","Grass","Rabbit","Fox"].',
          },
          direction: {
            type: 'string',
            enum: ['right', 'down'],
            description: 'flow_chain: layout direction — right = a horizontal row, down = a vertical column. Default right.',
          },
          // balance_scale (two-pan scale; `tilt` reused from lever) / venn
          leftLabel: { type: 'string', description: 'balance_scale: label under the LEFT pan. venn: what is unique to the left circle.' },
          rightLabel: { type: 'string', description: 'balance_scale: label under the RIGHT pan. venn: what is unique to the right circle.' },
          // icon (a glyph from the fixed set at `size`, centered on x,y)
          name: {
            type: 'string',
            enum: ICON_NAMES,
            description: 'icon: which glyph to draw (one of the fixed set).',
          },
          size: { type: 'number', description: 'icon: glyph bounding height in canvas units (e.g. 20).' },
          // part_whole (a pie cut into equal wedges, some shaded)
          parts: { type: 'number', description: 'part_whole: number of equal wedges (2..12).' },
          filled: { type: 'number', description: 'part_whole: how many wedges are shaded (0..parts). e.g. 3 of 4.' },
          // tree_diagram (a root box + child boxes)
          root: { type: 'string', description: 'tree_diagram: the root/top box label.' },
          branches: { type: 'array', items: { type: 'string' }, description: 'tree_diagram: the child box labels under the root (2..5).' },
          // network (labelled nodes joined by edges)
          nodes: {
            type: 'array',
            description: 'network: nodes as {x,y,label?} on the 0..100 canvas (label = a short word).',
            items: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' }, label: { type: 'string' } }, required: ['x', 'y'] },
          },
          edges: {
            type: 'array',
            description: 'network: edges linking node indices {a,b}.',
            items: { type: 'object', properties: { a: { type: 'number' }, b: { type: 'number' } }, required: ['a', 'b'] },
          },
          // speech_bubble (a bubble with a tail)
          tailX: { type: 'number', description: 'speech_bubble: x the tail points to (default just below-left of the bubble).' },
          tailY: { type: 'number', description: 'speech_bubble: y the tail points to (default just below the bubble).' },
          // timeline (events marked along a line)
          events: {
            type: 'array',
            description: 'timeline: events as {at, label} where at is 0..1 along the line (0 = start, 1 = end).',
            items: { type: 'object', properties: { at: { type: 'number' }, label: { type: 'string' } }, required: ['at', 'label'] },
          },
          // venn (leftLabel/rightLabel reused from balance_scale; bothLabel = the overlap)
          bothLabel: { type: 'string', description: 'venn: label for the shared/overlap region.' },
          // layers (stacked labelled bands, top = layers[0])
          layers: { type: 'array', items: { type: 'string' }, description: 'layers: the band labels top→bottom (2..6), e.g. ["Crust","Mantle","Outer core","Inner core"].' },
          // matrix (rows/cols reused from grid; header + cell text)
          rowLabels: { type: 'array', items: { type: 'string' }, description: 'matrix: labels left of each row.' },
          colLabels: { type: 'array', items: { type: 'string' }, description: 'matrix: header labels above each column.' },
          cells: { type: 'array', items: { type: 'string' }, description: 'matrix: cell text, row-major (row 0 left→right, then row 1, …).' },
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
