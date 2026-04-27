/**
 * Geometry Solver
 *
 * Translates a declarative construction spec into a concrete geometry
 * payload (points + segments + circles + polygons + arcs + angles) that
 * GeometryRenderer can paint as-is.
 *
 * The brain emits intent: "chord on circle C with length 1/4 of the
 * diameter, top of the circle, name endpoints A and B." This file
 * resolves that into exact coordinates so the brain never does the
 * arithmetic — and never gets it wrong. Each construction has a single
 * closed-form solution; together they replace the snap/validator
 * heuristics that we've been accreting one bug at a time.
 *
 * Add new constructions by extending the Step union and the dispatch
 * switch in solveStep. Keep each implementation pure: read from `state`,
 * return new objects, no side effects.
 */

import type {
  GeometryPoint,
  GeometrySegment,
  GeometryCircle,
  GeometryPolygon,
  GeometryArc,
  GeometryAngle,
} from '@/lib/knowledge/types';

// ─── Public spec ─────────────────────────────────────────────────────────────

export interface ConstructedGeometrySpec {
  title?: string;
  given?: Given[];
  steps?: Step[];
  display?: DisplayOpts;
}

export interface DisplayOpts {
  grid?: boolean;
  axes?: boolean;
  viewRange?: { x: [number, number]; y: [number, number] };
  /** Point ids that should render with a "(x, y)" tuple appended to the label. */
  showCoords?: string[];
  /** Segment ids that should render with their actual length appended. */
  showLength?: string[];
  /** Override the default label for a given/constructed object id. */
  labels?: Record<string, string>;
  /** Override the default color for a given/constructed object id. */
  colors?: Record<string, string>;
  /** Mark a segment dashed (for radii/perpendiculars commonly drawn that way). */
  dashed?: string[];
}

// Givens: explicit, raw objects.
/** Anywhere a point id is expected, an inline `{ x, y }` literal also
 *  works — the solver synthesizes an anonymous point and threads its
 *  id through. Saves the brain from declaring trivial anchor points
 *  for ad-hoc lines / segments / polygon vertices. */
type PtRef = string | { x: number; y: number };

export type Given =
  | { id: string; kind: 'point'; x: number; y: number; label?: string }
  | { id: string; kind: 'circle'; center: string; radius: number; label?: string }
  | { id: string; kind: 'segment'; from: PtRef; to: PtRef; label?: string }
  | { id: string; kind: 'line'; through: [PtRef, PtRef]; label?: string }
  | { id: string; kind: 'polygon'; vertices: PtRef[]; label?: string };

// Steps: derived objects. Each step has an id (its primary output).
// Multi-output steps (chord = 2 points + 1 segment) name child outputs by
// underscore-suffixing the parent id: e.g. step id "ch" creates points
// "ch_from" and "ch_to". Underscore (not dot) because the brain reaches
// for it naturally and the dot form was a documented friction point. The
// brain may also pass explicit `endpoints: { from: 'A', to: 'B' }` to
// name the points directly; those names go into the same namespace.
export type Step =
  | StepMidpoint
  | StepPointOnCircle
  | StepChord
  | StepRadius
  | StepDiameter
  | StepTangentAt
  | StepTangentFrom
  | StepPerpBisector
  | StepPerpFrom
  | StepParallelThrough
  | StepIntersect
  | StepPolygonRegular
  | StepTriangleCenter
  // "Given-shape" steps — explicit objects the brain naturally declares
  // alongside derived constructions, not separately under `given`.
  | StepDeclareSegment
  | StepDeclareLine
  | StepDeclarePolygon
  | StepDeclareCircle
  // Circle-creation constructions — without these, the brain has no way
  // to define a circle from constraints (only from explicit center+radius
  // in `given`). Common asks like "the incircle of triangle ABC" or "the
  // circle through A, B, C" need a one-shot construction, otherwise the
  // brain composes a radius step that references a circle that doesn't
  // exist yet and we error out.
  | StepCircleThroughPoint
  | StepCircleThroughThree
  | StepIncircle
  | StepCircumcircle
  // Tier 1 — foundational dozen.
  | StepRay
  | StepAngleBisector
  | StepExternalAngleBisector
  | StepSectionPoint
  | StepReflectPoint
  | StepRotatePoint
  | StepTranslatePoint
  | StepDilatePoint
  | StepExcircle
  | StepTangentsFromExternal
  | StepArc
  | StepSector;

interface StepCommon {
  id: string;
  label?: string;
}

/** Midpoint of an existing segment, OR the midpoint of two named points. */
export interface StepMidpoint extends StepCommon {
  kind: 'midpoint';
  of: string | { from: string; to: string };
}

/** A point on a given circle at a specified angle (degrees, CCW from +x). */
export interface StepPointOnCircle extends StepCommon {
  kind: 'point_on_circle';
  on: string;
  angle: number;
}

/** A chord on a circle. Either give the brain a length (absolute or ratio)
 *  + direction + position, OR give it an explicit `through` point and a
 *  direction. The brain picks the simpler description. */
export interface StepChord extends StepCommon {
  kind: 'chord';
  on: string;
  /** Endpoint ids — defaults to `${id}_from` / `${id}_to`. */
  endpoints?: { from: string; to: string };
  length?: number | { ratio: number; of: 'radius' | 'diameter' };
  /** Degrees CCW from +x, OR a keyword. */
  direction?: number | 'horizontal' | 'vertical';
  /** Which side of the circle when length < diameter. Defaults to 'top'. */
  position?: 'top' | 'bottom' | 'left' | 'right';
  /** Force the chord to pass through a specific point (overrides position). */
  through?: string;
}

/** Segment from circle center to a point on the circle. */
export interface StepRadius extends StepCommon {
  kind: 'radius';
  on: string;
  /** The endpoint on the circle. Either an existing point id, or an
   *  angle (degrees) — in which case a new point is created at id. */
  to: string | { angle: number; pointId?: string };
}

/** Diameter through the circle center. */
export interface StepDiameter extends StepCommon {
  kind: 'diameter';
  on: string;
  endpoints?: { from: string; to: string };
  direction?: number | 'horizontal' | 'vertical';
  /** Force the diameter to pass through a specific point on the circle. */
  through?: string;
}

/** Tangent line to a circle at an existing point on the circle. */
export interface StepTangentAt extends StepCommon {
  kind: 'tangent_at';
  on: string;       // circle id
  point: string;    // point on circle
  /** Length of the rendered tangent segment (centered on the point). */
  length?: number;
}

/** Tangent from an external point to a circle. Two valid lines exist —
 *  pick by `prefer`. Yields the tangent segment plus the point of tangency. */
export interface StepTangentFrom extends StepCommon {
  kind: 'tangent_from';
  on: string;
  external: string;
  prefer?: 'cw' | 'ccw';   // clockwise / counter-clockwise from external→center
  /** Id of the point of tangency. Defaults to `${id}_touch`. */
  touchId?: string;
}

/** Perpendicular bisector of a segment (or pair of points). Yields a line
 *  through the segment's midpoint, perpendicular to the segment. */
export interface StepPerpBisector extends StepCommon {
  kind: 'perpendicular_bisector';
  of: string | { from: string; to: string };
  /** Half-length of the rendered bisector line. */
  length?: number;
}

/** Perpendicular from a point to a line or segment. Yields the segment
 *  from the point to the foot of the perpendicular. */
export interface StepPerpFrom extends StepCommon {
  kind: 'perpendicular_from';
  /** The point we drop the perpendicular from. */
  from: string;
  /** The line or segment we drop onto (id, "x-axis"/"y-axis", or inline). */
  to: string | { through: [string | { x: number; y: number }, string | { x: number; y: number }] };
  /** Id of the foot point. Defaults to `${id}_foot`. */
  footId?: string;
}

/** Line through a point parallel to a reference line/segment. */
export interface StepParallelThrough extends StepCommon {
  kind: 'parallel_through';
  /** The point the parallel line passes through. */
  through: string;
  /** The line/segment we want to be parallel to (id, "x-axis"/"y-axis",
   *  or inline). */
  of: string | { through: [string | { x: number; y: number }, string | { x: number; y: number }] };
  length?: number;
}

/** Intersection point(s) of two objects. Each (line/segment, line/segment)
 *  yields one point; (line, circle) and (circle, circle) yield up to two,
 *  pick by `prefer`. */
export interface StepIntersect extends StepCommon {
  kind: 'intersect';
  of: [string, string];
  prefer?: 'cw' | 'ccw' | 'first' | 'second';
  /** When two intersection points exist, the secondary id (defaults to
   *  `${id}_b`). */
  secondId?: string;
}

/** Regular polygon inscribed in a circle. Vertices auto-named v_0…v_{n-1}
 *  unless `vertexIds` is supplied. */
export interface StepPolygonRegular extends StepCommon {
  kind: 'polygon_regular';
  on: string;        // circle (vertices on it)
  sides: number;
  /** Rotation in degrees from the default (first vertex on +x axis). */
  rotation?: number;
  vertexIds?: string[];
}

/** Centroid / incenter / circumcenter / orthocenter of a triangle. */
export interface StepTriangleCenter extends StepCommon {
  kind: 'triangle_center';
  /** The triangle, named by its three vertex point ids. */
  vertices: [string, string, string];
  type: 'centroid' | 'incenter' | 'circumcenter' | 'orthocenter';
}

// Given-shape steps. The brain often emits these in `steps` rather than
// `given` because composition reads top-to-bottom (declare points →
// connect them → derive things from those connections). The data is
// the same as the corresponding Given variant.

export interface StepDeclareSegment extends StepCommon {
  kind: 'segment';
  from: PtRef;
  to: PtRef;
}
export interface StepDeclareLine extends StepCommon {
  kind: 'line';
  through: [PtRef, PtRef];
}
export interface StepDeclarePolygon extends StepCommon {
  kind: 'polygon';
  vertices: PtRef[];
}
export interface StepDeclareCircle extends StepCommon {
  kind: 'circle';
  center: string;
  radius: number;
}

/** Circle defined by a center and a point that lies on it. Useful when
 *  the brain wants "the circle centered at I through tangent point T1"
 *  without computing the radius itself. */
export interface StepCircleThroughPoint extends StepCommon {
  kind: 'circle_through_point';
  center: string;
  through: string;
}

/** Circle defined by three points it passes through (the unique
 *  circumscribed circle of those points). */
export interface StepCircleThroughThree extends StepCommon {
  kind: 'circle_through_three';
  points: [string, string, string];
}

/** Inscribed circle of a triangle. Yields the circle plus the incenter
 *  point and the three tangent-point feet on the sides. Auto-ids:
 *  `${id}_center`, `${id}_T1`, `${id}_T2`, `${id}_T3`. Brain can override
 *  via `centerId` and `tangentIds`. */
export interface StepIncircle extends StepCommon {
  kind: 'incircle';
  vertices: [string, string, string];
  centerId?: string;
  tangentIds?: [string, string, string];
}

/** Circumscribed circle of a triangle. Yields the circle plus the
 *  circumcenter point. Auto-id: `${id}_center` for the circumcenter
 *  unless `centerId` is provided. */
export interface StepCircumcircle extends StepCommon {
  kind: 'circumcircle';
  vertices: [string, string, string];
  centerId?: string;
}

// ─── Tier 1 — foundational constructions ──────────────────────────────────────

/** Directed half-line from `from` along the direction toward `toward`,
 *  rendered as a segment of `length`. Stored as a segment. The
 *  endpoint at `length` distance is created at `${id}_end` (or
 *  `endId` override). */
export interface StepRay extends StepCommon {
  kind: 'ray';
  from: string;
  toward: string;
  length?: number;
  endId?: string;
}

/** Interior angle bisector at a vertex. The two sides of the angle are
 *  given by points `from` and `to` (the bisector is the ray from the
 *  vertex into the interior of ∠from-vertex-to). Output: a segment
 *  from the vertex along the bisector direction with the given length. */
export interface StepAngleBisector extends StepCommon {
  kind: 'angle_bisector';
  vertex: string;
  from: string;
  to: string;
  length?: number;
}

/** External angle bisector — perpendicular to the interior bisector. */
export interface StepExternalAngleBisector extends StepCommon {
  kind: 'external_angle_bisector';
  vertex: string;
  from: string;
  to: string;
  length?: number;
}

/** Point dividing segment AB in the ratio m:n (from A toward B).
 *  Section formula: P = (n·A + m·B) / (m+n). */
export interface StepSectionPoint extends StepCommon {
  kind: 'section_point';
  of: string | { from: string; to: string };
  ratio: [number, number];   // [m, n] — m toward "to", n toward "from"
}

/** Reflect a point across a line/segment. The mirror can be:
 *   - id of a declared line/segment
 *   - "x-axis" or "y-axis" keyword
 *   - inline { through: [a, b] } where each endpoint is a point id or
 *     a literal { x, y } coord. */
export interface StepReflectPoint extends StepCommon {
  kind: 'reflect_point';
  point: string;
  across: string | { through: [string | { x: number; y: number }, string | { x: number; y: number }] };
}

/** Rotate a point around a center by angle (degrees, CCW positive). */
export interface StepRotatePoint extends StepCommon {
  kind: 'rotate_point';
  point: string;
  around: string;            // pivot point id
  angle: number;             // degrees
}

/** Translate a point by a (dx, dy) vector. */
export interface StepTranslatePoint extends StepCommon {
  kind: 'translate_point';
  point: string;
  by: { dx: number; dy: number };
}

/** Dilate (scale) a point about a center by factor k. */
export interface StepDilatePoint extends StepCommon {
  kind: 'dilate_point';
  point: string;
  about: string;             // center of dilation
  factor: number;
}

/** Excircle opposite a chosen vertex of a triangle. The excircle is
 *  tangent to the side opposite the vertex and to the extensions of
 *  the other two sides. Output: circle + center point + three tangent
 *  feet (one on the opposite side, two on the extended adjacent sides). */
export interface StepExcircle extends StepCommon {
  kind: 'excircle';
  vertices: [string, string, string];
  /** Which vertex's opposite side the excircle is tangent to. Defaults
   *  to the FIRST vertex, i.e. the excircle opposite A. */
  opposite?: 'first' | 'second' | 'third';
  centerId?: string;
  tangentIds?: [string, string, string];
}

/** BOTH tangents from an external point — pair of segments to the two
 *  points of tangency. Output: two segments + two touch points. */
export interface StepTangentsFromExternal extends StepCommon {
  kind: 'tangents_from_external';
  on: string;
  external: string;
  /** Ids for the two segments. Defaults: `${id}_a`, `${id}_b`.
   *  Touch points: `${id}_touchA`, `${id}_touchB`. */
  segmentIds?: [string, string];
  touchIds?: [string, string];
}

/** Arc on a circle between two on-circle points. The minor or major
 *  arc is selected via `direction` (CCW from `from` to `to` is the
 *  default). Stored as a GeometryArc primitive. */
export interface StepArc extends StepCommon {
  kind: 'arc';
  on: string;                // circle
  from: string;              // on-circle point
  to: string;                // on-circle point
  direction?: 'ccw' | 'cw';
}

/** Filled wedge (sector) between two radii of a circle. Shares the
 *  same angle parameters as `arc`. Stored as a polygon (center plus
 *  arc-sampled boundary). */
export interface StepSector extends StepCommon {
  kind: 'sector';
  on: string;
  from: string;
  to: string;
  direction?: 'ccw' | 'cw';
  /** How many segments to sample the arc with. Default 24. */
  arcSegments?: number;
}

// ─── Internal resolution state ────────────────────────────────────────────────

interface ResolvedPoint { kind: 'point'; id: string; x: number; y: number; label?: string }
interface ResolvedCircle { kind: 'circle'; id: string; center: string; radius: number; label?: string }
interface ResolvedSegment { kind: 'segment'; id: string; from: string; to: string; label?: string }
interface ResolvedLine { kind: 'line'; id: string; pointA: string; pointB: string; label?: string }
interface ResolvedPolygon { kind: 'polygon'; id: string; vertices: string[]; label?: string }
interface ResolvedArc {
  kind: 'arc';
  id: string;
  center: string;
  radius: number;
  startAngle: number;     // degrees
  endAngle: number;       // degrees
  label?: string;
}

type Resolved = ResolvedPoint | ResolvedCircle | ResolvedSegment | ResolvedLine | ResolvedPolygon | ResolvedArc;

interface State {
  byId: Map<string, Resolved>;
  /** Insertion order for stable rendering. */
  order: string[];
}

function setObject(state: State, obj: Resolved): void {
  if (!state.byId.has(obj.id)) state.order.push(obj.id);
  state.byId.set(obj.id, obj);
}

function pt(state: State, id: string): ResolvedPoint {
  const o = state.byId.get(id);
  if (!o || o.kind !== 'point') throw new Error(`Expected point "${id}", got ${o?.kind ?? 'undefined'}`);
  return o;
}
function circ(state: State, id: string): ResolvedCircle {
  const o = state.byId.get(id);
  if (!o || o.kind !== 'circle') throw new Error(`Expected circle "${id}", got ${o?.kind ?? 'undefined'}`);
  return o;
}
function lineLike(state: State, id: string): { ax: number; ay: number; bx: number; by: number } {
  const o = state.byId.get(id);
  if (!o) throw new Error(`Unknown reference "${id}"`);
  if (o.kind === 'line') {
    const A = pt(state, o.pointA), B = pt(state, o.pointB);
    return { ax: A.x, ay: A.y, bx: B.x, by: B.y };
  }
  if (o.kind === 'segment') {
    const A = pt(state, o.from), B = pt(state, o.to);
    return { ax: A.x, ay: A.y, bx: B.x, by: B.y };
  }
  throw new Error(`Expected line or segment, got ${o.kind} for "${id}"`);
}

/**
 * A line reference. Brains reach for several natural forms beyond the
 * "id of a previously declared line/segment" we originally accepted:
 *   - "x-axis" / "y-axis" — keyword shortcuts (very common in K-12
 *     reflection / mirror problems).
 *   - { through: [pointId | {x,y}, pointId | {x,y}] } — inline
 *     anonymous line. Useful when the brain wants to reflect across an
 *     ad-hoc line without first declaring it.
 *   - id string — the original form, still works.
 *
 * resolveLineRef accepts any of these and returns the same shape
 * lineLike does. Used by reflect_point / perpendicular_from /
 * parallel_through; intersect still requires explicit ids since it
 * needs to know whether the reference is a line or a circle.
 */
type LineRef =
  | string
  | { through: [PointRef, PointRef] };
type PointRef = string | { x: number; y: number };

function resolvePointRef(state: State, ref: PointRef): { x: number; y: number } {
  if (typeof ref === 'string') {
    const p = pt(state, ref);
    return { x: p.x, y: p.y };
  }
  return { x: ref.x, y: ref.y };
}

/**
 * Normalize a "point ref or inline {x,y}" to a point id. If the ref is an
 * inline object, register a synthetic anonymous point and return its id.
 * The synthetic id is derived from `ownerId` so identical inline coords
 * inside the same parent (line, segment, polygon) get stable distinct ids.
 *
 * Used wherever a Given/Step expects a point id (line.through entries,
 * segment.from/to, polygon.vertices). Brains naturally inline `{x,y}`
 * for ad-hoc reference points without a separate point declaration.
 */
function normalizePointRef(
  state: State,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref: any,
  ownerId: string,
  slot: string,
): string {
  if (typeof ref === 'string') return ref;
  if (ref && typeof ref === 'object' && Number.isFinite(ref.x) && Number.isFinite(ref.y)) {
    const synthId = `${ownerId}__${slot}`;
    if (!state.byId.has(synthId)) {
      setObject(state, { kind: 'point', id: synthId, x: ref.x, y: ref.y });
    }
    return synthId;
  }
  throw new Error(`expected point id or { x, y } at ${ownerId}.${slot}, got ${JSON.stringify(ref)}`);
}

function resolveLineRef(state: State, ref: LineRef): { ax: number; ay: number; bx: number; by: number } {
  if (typeof ref === 'string') {
    if (ref === 'x-axis') return { ax: -1000, ay: 0, bx: 1000, by: 0 };
    if (ref === 'y-axis') return { ax: 0, ay: -1000, bx: 0, by: 1000 };
    return lineLike(state, ref);
  }
  if (ref && typeof ref === 'object' && 'through' in ref && Array.isArray(ref.through) && ref.through.length === 2) {
    const a = resolvePointRef(state, ref.through[0]);
    const b = resolvePointRef(state, ref.through[1]);
    return { ax: a.x, ay: a.y, bx: b.x, by: b.y };
  }
  throw new Error(`Unknown line reference: ${JSON.stringify(ref)}`);
}

function dirVec(direction: StepChord['direction']): [number, number] {
  if (direction === undefined) return [1, 0];
  if (direction === 'horizontal') return [1, 0];
  if (direction === 'vertical') return [0, 1];
  const r = (direction * Math.PI) / 180;
  return [Math.cos(r), Math.sin(r)];
}

function sideMultiplier(position: StepChord['position'] | undefined, dir: [number, number]): number {
  // The chord midpoint is at center + h * perp(dir). +/- decides which side.
  // Position keywords map to the natural human reading: "top" should put the
  // midpoint upward (positive y), regardless of chord direction.
  const perp: [number, number] = [-dir[1], dir[0]];
  const want: { [k: string]: [number, number] } = {
    top: [0, 1],
    bottom: [0, -1],
    left: [-1, 0],
    right: [1, 0],
  };
  const w = want[position ?? 'top'];
  return Math.sign(perp[0] * w[0] + perp[1] * w[1]) || 1;
}

function chordLength(spec: StepChord, c: ResolvedCircle): number {
  if (spec.length === undefined) return c.radius; // sensible default
  if (typeof spec.length === 'number') return spec.length;
  const ref = spec.length.of === 'diameter' ? 2 * c.radius : c.radius;
  return spec.length.ratio * ref;
}

// ─── Step dispatch ────────────────────────────────────────────────────────────

function solveStep(step: Step, state: State): void {
  switch (step.kind) {
    case 'midpoint': return solveMidpoint(step, state);
    case 'point_on_circle': return solvePointOnCircle(step, state);
    case 'chord': return solveChord(step, state);
    case 'radius': return solveRadius(step, state);
    case 'diameter': return solveDiameter(step, state);
    case 'tangent_at': return solveTangentAt(step, state);
    case 'tangent_from': return solveTangentFrom(step, state);
    case 'perpendicular_bisector': return solvePerpBisector(step, state);
    case 'perpendicular_from': return solvePerpFrom(step, state);
    case 'parallel_through': return solveParallelThrough(step, state);
    case 'intersect': return solveIntersect(step, state);
    case 'polygon_regular': return solvePolygonRegular(step, state);
    case 'triangle_center': return solveTriangleCenter(step, state);
    // Given-shape steps: same logic as their `given` counterparts, but
    // declarable inline alongside derived steps. Keeps brain emissions
    // that mix givens and constructions in one array working.
    case 'segment':
      setObject(state, {
        kind: 'segment', id: step.id,
        from: normalizePointRef(state, step.from, step.id, 'from'),
        to: normalizePointRef(state, step.to, step.id, 'to'),
        label: step.label,
      });
      return;
    case 'line':
      setObject(state, {
        kind: 'line', id: step.id,
        pointA: normalizePointRef(state, step.through[0], step.id, 'a'),
        pointB: normalizePointRef(state, step.through[1], step.id, 'b'),
        label: step.label,
      });
      return;
    case 'polygon':
      setObject(state, {
        kind: 'polygon', id: step.id,
        vertices: step.vertices.map((v, i) => normalizePointRef(state, v, step.id, `v${i}`)),
        label: step.label,
      });
      return;
    case 'circle':
      if (!state.byId.has(step.center)) throw new Error(`circle "${step.id}": center "${step.center}" not declared`);
      setObject(state, { kind: 'circle', id: step.id, center: step.center, radius: step.radius, label: step.label });
      return;
    case 'circle_through_point': return solveCircleThroughPoint(step, state);
    case 'circle_through_three': return solveCircleThroughThree(step, state);
    case 'incircle': return solveIncircle(step, state);
    case 'circumcircle': return solveCircumcircle(step, state);
    case 'ray': return solveRay(step, state);
    case 'angle_bisector': return solveAngleBisector(step, state);
    case 'external_angle_bisector': return solveExternalAngleBisector(step, state);
    case 'section_point': return solveSectionPoint(step, state);
    case 'reflect_point': return solveReflectPoint(step, state);
    case 'rotate_point': return solveRotatePoint(step, state);
    case 'translate_point': return solveTranslatePoint(step, state);
    case 'dilate_point': return solveDilatePoint(step, state);
    case 'excircle': return solveExcircle(step, state);
    case 'tangents_from_external': return solveTangentsFromExternal(step, state);
    case 'arc': return solveArc(step, state);
    case 'sector': return solveSector(step, state);
  }
}

function solveMidpoint(step: StepMidpoint, state: State): void {
  let A: ResolvedPoint, B: ResolvedPoint;
  if (typeof step.of === 'string') {
    const seg = state.byId.get(step.of);
    if (!seg || seg.kind !== 'segment') throw new Error(`midpoint: "${step.of}" is not a segment`);
    A = pt(state, seg.from);
    B = pt(state, seg.to);
  } else {
    A = pt(state, step.of.from);
    B = pt(state, step.of.to);
  }
  setObject(state, {
    kind: 'point', id: step.id, x: (A.x + B.x) / 2, y: (A.y + B.y) / 2, label: step.label,
  });
}

function solvePointOnCircle(step: StepPointOnCircle, state: State): void {
  const c = circ(state, step.on);
  const center = pt(state, c.center);
  const r = (step.angle * Math.PI) / 180;
  setObject(state, {
    kind: 'point', id: step.id,
    x: center.x + c.radius * Math.cos(r),
    y: center.y + c.radius * Math.sin(r),
    label: step.label,
  });
}

function solveChord(step: StepChord, state: State): void {
  const c = circ(state, step.on);
  const center = pt(state, c.center);
  const len = chordLength(step, c);
  if (len <= 0 || len > 2 * c.radius) {
    throw new Error(`chord "${step.id}": length ${len} not valid for radius ${c.radius}`);
  }
  const half = len / 2;
  const h = Math.sqrt(Math.max(0, c.radius * c.radius - half * half));

  let dir: [number, number];
  let mid: { x: number; y: number };

  if (step.through) {
    // Force through a given point: chord direction is perpendicular to
    // the line from center to that point, rotated to make the through-
    // point sit on the chord at the right distance.
    const T = pt(state, step.through);
    const dx = T.x - center.x;
    const dy = T.y - center.y;
    const distToCenter = Math.hypot(dx, dy);
    if (distToCenter > c.radius + 1e-6) {
      throw new Error(`chord "${step.id}": through-point "${step.through}" is outside circle`);
    }
    // Chord perpendicular bisector passes through center; midpoint is the
    // foot of perpendicular from center to the chord, which (for a chord
    // forced through T) is the projection of T onto a chord direction
    // chosen to satisfy the length constraint. Solve:
    //   |T - mid|² = half² - (chord-midpoint-to-T offset along chord)²
    // Simpler: midpoint M is along center→T at distance h from center,
    // ONLY if T is the midpoint. If not, chord is the unique line
    // through T whose perpendicular foot from center lies at distance h.
    // We compute that direction:
    if (distToCenter < 1e-9) {
      // T = center → chord passes through center → it's a diameter.
      // Use direction if given, else horizontal.
      dir = dirVec(step.direction);
      mid = { x: center.x, y: center.y };
    } else {
      // Let u be unit center→T. The chord's foot M from center satisfies
      // M = center + h * û (perp), and the chord direction is û.
      // For the chord to contain T: T = M + s*direction → s = (T-M)·dir.
      // We have two solutions for û (perp to chord). Choose so that the
      // resulting chord contains T at signed distance s with |s| ≤ half.
      // Easier closed form: chord direction is perpendicular to û_chosen,
      // where û_chosen is the unit vector along center→T projected to
      // the perpendicular of the chord. Skip the algebra: parametrize.
      // Use the perpendicular-from-center foot identity: |center - M| = h
      // and M is the projection of center onto the chord line. The chord
      // line passes through T with direction d. Foot M = T - ((T-center)·d) d.
      // |center - M| = h ⇒ ((T-center) - ((T-center)·d) d) has length h.
      // Let v = T - center. Let v⊥ = the component of v perpendicular to d.
      // |v⊥| = h. So |v|² - (v·d)² = h². ⇒ (v·d)² = |v|² - h².
      const vMag2 = distToCenter * distToCenter;
      const proj2 = vMag2 - h * h;
      if (proj2 < -1e-9) {
        throw new Error(`chord "${step.id}": through-point inconsistent with declared length`);
      }
      const proj = Math.sqrt(Math.max(0, proj2));
      // Two candidate directions: rotate u by ±θ where cos θ = proj / |v|.
      // But we just want any d satisfying v·d = ±proj and |d|=1. Pick:
      // d = (cos α, sin α) where α = atan2(v.y, v.x) ± acos(proj/|v|).
      const baseAngle = Math.atan2(dy, dx);
      const delta = distToCenter < 1e-9 ? 0 : Math.acos(Math.min(1, Math.max(-1, proj / distToCenter)));
      const alpha = baseAngle + delta;
      dir = [Math.cos(alpha), Math.sin(alpha)];
      // Foot M from center:
      const dot = (T.x - center.x) * dir[0] + (T.y - center.y) * dir[1];
      mid = { x: T.x - dot * dir[0], y: T.y - dot * dir[1] };
    }
  } else {
    dir = dirVec(step.direction);
    const sign = sideMultiplier(step.position, dir);
    const perp: [number, number] = [-dir[1], dir[0]];
    mid = { x: center.x + sign * h * perp[0], y: center.y + sign * h * perp[1] };
  }

  const fromId = step.endpoints?.from ?? `${step.id}_from`;
  const toId = step.endpoints?.to ?? `${step.id}_to`;
  setObject(state, {
    kind: 'point', id: fromId,
    x: round2(mid.x - half * dir[0]),
    y: round2(mid.y - half * dir[1]),
  });
  setObject(state, {
    kind: 'point', id: toId,
    x: round2(mid.x + half * dir[0]),
    y: round2(mid.y + half * dir[1]),
  });
  setObject(state, {
    kind: 'segment', id: step.id, from: fromId, to: toId, label: step.label,
  });
}

function solveRadius(step: StepRadius, state: State): void {
  const c = circ(state, step.on);
  const center = pt(state, c.center);
  let endId: string;
  if (typeof step.to === 'string') {
    endId = step.to;
    pt(state, endId); // validate exists
  } else {
    endId = step.to.pointId ?? `${step.id}_end`;
    const r = (step.to.angle * Math.PI) / 180;
    setObject(state, {
      kind: 'point', id: endId,
      x: round2(center.x + c.radius * Math.cos(r)),
      y: round2(center.y + c.radius * Math.sin(r)),
    });
  }
  setObject(state, {
    kind: 'segment', id: step.id, from: c.center, to: endId, label: step.label,
  });
}

function solveDiameter(step: StepDiameter, state: State): void {
  const c = circ(state, step.on);
  const center = pt(state, c.center);
  let dir: [number, number];
  if (step.through) {
    const T = pt(state, step.through);
    const dx = T.x - center.x;
    const dy = T.y - center.y;
    const m = Math.hypot(dx, dy) || 1;
    dir = [dx / m, dy / m];
  } else {
    dir = dirVec(step.direction);
  }
  const fromId = step.endpoints?.from ?? `${step.id}_from`;
  const toId = step.endpoints?.to ?? `${step.id}_to`;
  setObject(state, {
    kind: 'point', id: fromId,
    x: round2(center.x - c.radius * dir[0]),
    y: round2(center.y - c.radius * dir[1]),
  });
  setObject(state, {
    kind: 'point', id: toId,
    x: round2(center.x + c.radius * dir[0]),
    y: round2(center.y + c.radius * dir[1]),
  });
  setObject(state, {
    kind: 'segment', id: step.id, from: fromId, to: toId, label: step.label,
  });
}

function solveTangentAt(step: StepTangentAt, state: State): void {
  const c = circ(state, step.on);
  const center = pt(state, c.center);
  const P = pt(state, step.point);
  const rx = P.x - center.x;
  const ry = P.y - center.y;
  // Tangent direction is perpendicular to radius at P.
  const m = Math.hypot(rx, ry) || 1;
  const tx = -ry / m;
  const ty = rx / m;
  const half = (step.length ?? c.radius * 1.5) / 2;
  const fromId = `${step.id}_from`;
  const toId = `${step.id}_to`;
  setObject(state, { kind: 'point', id: fromId, x: round2(P.x - half * tx), y: round2(P.y - half * ty) });
  setObject(state, { kind: 'point', id: toId, x: round2(P.x + half * tx), y: round2(P.y + half * ty) });
  setObject(state, { kind: 'segment', id: step.id, from: fromId, to: toId, label: step.label });
}

function solveTangentFrom(step: StepTangentFrom, state: State): void {
  const c = circ(state, step.on);
  const center = pt(state, c.center);
  const E = pt(state, step.external);
  const dx = E.x - center.x;
  const dy = E.y - center.y;
  const d = Math.hypot(dx, dy);
  if (d < c.radius - 1e-6) {
    throw new Error(`tangent_from "${step.id}": external point is inside circle`);
  }
  const r = c.radius;
  // Tangent length from E:
  const tLen = Math.sqrt(Math.max(0, d * d - r * r));
  // Angle from center→E to center→touch is acos(r/d).
  const theta = Math.acos(Math.min(1, Math.max(-1, r / d)));
  const baseAngle = Math.atan2(dy, dx);
  const sign = step.prefer === 'cw' ? -1 : 1;
  const touchAngle = baseAngle + sign * theta;
  const touchId = step.touchId ?? `${step.id}_touch`;
  const Tx = center.x + r * Math.cos(touchAngle);
  const Ty = center.y + r * Math.sin(touchAngle);
  setObject(state, { kind: 'point', id: touchId, x: round2(Tx), y: round2(Ty) });
  setObject(state, { kind: 'segment', id: step.id, from: step.external, to: touchId, label: step.label });
  void tLen; // length is implicit in coords; expose later if useful
}

function solvePerpBisector(step: StepPerpBisector, state: State): void {
  let A: ResolvedPoint, B: ResolvedPoint;
  if (typeof step.of === 'string') {
    const seg = state.byId.get(step.of);
    if (!seg || seg.kind !== 'segment') throw new Error(`perpendicular_bisector: "${step.of}" is not a segment`);
    A = pt(state, seg.from); B = pt(state, seg.to);
  } else {
    A = pt(state, step.of.from); B = pt(state, step.of.to);
  }
  const mx = (A.x + B.x) / 2;
  const my = (A.y + B.y) / 2;
  const dx = B.x - A.x;
  const dy = B.y - A.y;
  const m = Math.hypot(dx, dy) || 1;
  const px = -dy / m;
  const py = dx / m;
  const half = (step.length ?? Math.hypot(dx, dy)) / 2;
  const fromId = `${step.id}_from`;
  const toId = `${step.id}_to`;
  setObject(state, { kind: 'point', id: fromId, x: round2(mx - half * px), y: round2(my - half * py) });
  setObject(state, { kind: 'point', id: toId, x: round2(mx + half * px), y: round2(my + half * py) });
  setObject(state, { kind: 'segment', id: step.id, from: fromId, to: toId, label: step.label });
}

function solvePerpFrom(step: StepPerpFrom, state: State): void {
  // Silent backward-compat: brain may still emit `point` (legacy alias for
  // `from`). Documented schema is `from`/`to` only.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = step as any;
  const fromPointId = step.from ?? raw.point;
  if (!fromPointId) throw new Error(`perpendicular_from "${step.id}": missing 'from'`);
  if (!step.to) throw new Error(`perpendicular_from "${step.id}": missing 'to'`);
  const P = pt(state, fromPointId);
  const ln = resolveLineRef(state, step.to as LineRef);
  const dx = ln.bx - ln.ax;
  const dy = ln.by - ln.ay;
  const len2 = dx * dx + dy * dy;
  const t = ((P.x - ln.ax) * dx + (P.y - ln.ay) * dy) / (len2 || 1);
  const fx = ln.ax + t * dx;
  const fy = ln.ay + t * dy;
  const footId = step.footId ?? `${step.id}_foot`;
  setObject(state, { kind: 'point', id: footId, x: round2(fx), y: round2(fy) });
  setObject(state, { kind: 'segment', id: step.id, from: fromPointId, to: footId, label: step.label });
}

function solveParallelThrough(step: StepParallelThrough, state: State): void {
  // Silent backward-compat: brain may still emit `point` (legacy alias for
  // `through`) or `to` (legacy alias for `of`). Documented schema is
  // `through`/`of` only.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const raw = step as any;
  const throughPointId = step.through ?? raw.point;
  const refLineId = step.of ?? raw.to;
  if (!throughPointId) throw new Error(`parallel_through "${step.id}": missing 'through'`);
  if (!refLineId) throw new Error(`parallel_through "${step.id}": missing 'of'`);
  const P = pt(state, throughPointId);
  const ln = resolveLineRef(state, refLineId as LineRef);
  const dx = ln.bx - ln.ax;
  const dy = ln.by - ln.ay;
  const m = Math.hypot(dx, dy) || 1;
  const ux = dx / m;
  const uy = dy / m;
  const half = (step.length ?? Math.hypot(dx, dy)) / 2;
  const fromId = `${step.id}_from`;
  const toId = `${step.id}_to`;
  setObject(state, { kind: 'point', id: fromId, x: round2(P.x - half * ux), y: round2(P.y - half * uy) });
  setObject(state, { kind: 'point', id: toId, x: round2(P.x + half * ux), y: round2(P.y + half * uy) });
  setObject(state, { kind: 'segment', id: step.id, from: fromId, to: toId, label: step.label });
}

function solveIntersect(step: StepIntersect, state: State): void {
  const a = state.byId.get(step.of[0]);
  const b = state.byId.get(step.of[1]);
  if (!a || !b) throw new Error(`intersect "${step.id}": unknown reference`);
  const isLineLike = (o: Resolved) => o.kind === 'line' || o.kind === 'segment';
  if (isLineLike(a) && isLineLike(b)) {
    const A = lineLike(state, step.of[0]);
    const B = lineLike(state, step.of[1]);
    const denom = (A.bx - A.ax) * (B.by - B.ay) - (A.by - A.ay) * (B.bx - B.ax);
    if (Math.abs(denom) < 1e-9) throw new Error(`intersect "${step.id}": lines are parallel`);
    const t = ((B.ax - A.ax) * (B.by - B.ay) - (B.ay - A.ay) * (B.bx - B.ax)) / denom;
    setObject(state, {
      kind: 'point', id: step.id,
      x: round2(A.ax + t * (A.bx - A.ax)),
      y: round2(A.ay + t * (A.by - A.ay)),
      label: step.label,
    });
    return;
  }
  if (isLineLike(a) && b.kind === 'circle') return intersectLineCircle(step, state, step.of[0], step.of[1]);
  if (a.kind === 'circle' && isLineLike(b)) return intersectLineCircle(step, state, step.of[1], step.of[0]);
  if (a.kind === 'circle' && b.kind === 'circle') return intersectCircleCircle(step, state, step.of[0], step.of[1]);
  throw new Error(`intersect "${step.id}": unsupported pair`);
}

function intersectLineCircle(step: StepIntersect, state: State, lineId: string, circleId: string): void {
  const ln = lineLike(state, lineId);
  const c = circ(state, circleId);
  const center = pt(state, c.center);
  const dx = ln.bx - ln.ax;
  const dy = ln.by - ln.ay;
  const fx = ln.ax - center.x;
  const fy = ln.ay - center.y;
  const A = dx * dx + dy * dy;
  const B = 2 * (fx * dx + fy * dy);
  const C = fx * fx + fy * fy - c.radius * c.radius;
  const disc = B * B - 4 * A * C;
  if (disc < 0) throw new Error(`intersect "${step.id}": line does not meet circle`);
  const sqrtD = Math.sqrt(disc);
  const t1 = (-B - sqrtD) / (2 * A);
  const t2 = (-B + sqrtD) / (2 * A);
  const p1 = { x: ln.ax + t1 * dx, y: ln.ay + t1 * dy };
  const p2 = { x: ln.ax + t2 * dx, y: ln.ay + t2 * dy };
  emitIntersectionPair(step, state, p1, p2);
}

function intersectCircleCircle(step: StepIntersect, state: State, c1Id: string, c2Id: string): void {
  const c1 = circ(state, c1Id), c2 = circ(state, c2Id);
  const O1 = pt(state, c1.center), O2 = pt(state, c2.center);
  const dx = O2.x - O1.x, dy = O2.y - O1.y;
  const d = Math.hypot(dx, dy);
  if (d > c1.radius + c2.radius + 1e-9 || d < Math.abs(c1.radius - c2.radius) - 1e-9 || d < 1e-9) {
    throw new Error(`intersect "${step.id}": circles do not meet at two points`);
  }
  const a = (c1.radius * c1.radius - c2.radius * c2.radius + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, c1.radius * c1.radius - a * a));
  const px = O1.x + a * dx / d;
  const py = O1.y + a * dy / d;
  const p1 = { x: px + h * dy / d, y: py - h * dx / d };
  const p2 = { x: px - h * dy / d, y: py + h * dx / d };
  emitIntersectionPair(step, state, p1, p2);
}

function emitIntersectionPair(step: StepIntersect, state: State, p1: { x: number; y: number }, p2: { x: number; y: number }): void {
  const pick = step.prefer === 'second' ? p2 : p1;
  const other = step.prefer === 'second' ? p1 : p2;
  setObject(state, { kind: 'point', id: step.id, x: round2(pick.x), y: round2(pick.y), label: step.label });
  if (step.secondId) {
    setObject(state, { kind: 'point', id: step.secondId, x: round2(other.x), y: round2(other.y) });
  }
}

function solvePolygonRegular(step: StepPolygonRegular, state: State): void {
  const c = circ(state, step.on);
  const center = pt(state, c.center);
  const n = step.sides;
  if (n < 3) throw new Error(`polygon_regular "${step.id}": need ≥ 3 sides`);
  const baseRot = ((step.rotation ?? 0) * Math.PI) / 180;
  const ids: string[] = [];
  for (let i = 0; i < n; i++) {
    const angle = baseRot + (2 * Math.PI * i) / n;
    const id = step.vertexIds?.[i] ?? `${step.id}_v${i}`;
    setObject(state, {
      kind: 'point', id,
      x: round2(center.x + c.radius * Math.cos(angle)),
      y: round2(center.y + c.radius * Math.sin(angle)),
    });
    ids.push(id);
  }
  // Edge segments around the polygon.
  for (let i = 0; i < n; i++) {
    const segId = `${step.id}_e${i}`;
    setObject(state, { kind: 'segment', id: segId, from: ids[i], to: ids[(i + 1) % n] });
  }
  setObject(state, { kind: 'polygon', id: step.id, vertices: ids, label: step.label });
}

function solveTriangleCenter(step: StepTriangleCenter, state: State): void {
  const A = pt(state, step.vertices[0]);
  const B = pt(state, step.vertices[1]);
  const C = pt(state, step.vertices[2]);
  let x: number, y: number;
  switch (step.type) {
    case 'centroid':
      x = (A.x + B.x + C.x) / 3;
      y = (A.y + B.y + C.y) / 3;
      break;
    case 'incenter': {
      const a = Math.hypot(B.x - C.x, B.y - C.y);
      const b = Math.hypot(C.x - A.x, C.y - A.y);
      const c = Math.hypot(A.x - B.x, A.y - B.y);
      const sum = a + b + c || 1;
      x = (a * A.x + b * B.x + c * C.x) / sum;
      y = (a * A.y + b * B.y + c * C.y) / sum;
      break;
    }
    case 'circumcenter': {
      const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
      if (Math.abs(d) < 1e-9) throw new Error(`circumcenter: triangle is degenerate`);
      const A2 = A.x * A.x + A.y * A.y;
      const B2 = B.x * B.x + B.y * B.y;
      const C2 = C.x * C.x + C.y * C.y;
      x = (A2 * (B.y - C.y) + B2 * (C.y - A.y) + C2 * (A.y - B.y)) / d;
      y = (A2 * (C.x - B.x) + B2 * (A.x - C.x) + C2 * (B.x - A.x)) / d;
      break;
    }
    case 'orthocenter': {
      // Orthocenter via altitude intersection. Use formula:
      // H = A + B + C - 2 * O   (for the circumcenter O, on Euler line)
      // Simpler: compute two altitudes and intersect.
      const O = (() => {
        const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
        if (Math.abs(d) < 1e-9) throw new Error(`orthocenter: triangle is degenerate`);
        const A2 = A.x * A.x + A.y * A.y;
        const B2 = B.x * B.x + B.y * B.y;
        const C2 = C.x * C.x + C.y * C.y;
        return {
          x: (A2 * (B.y - C.y) + B2 * (C.y - A.y) + C2 * (A.y - B.y)) / d,
          y: (A2 * (C.x - B.x) + B2 * (A.x - C.x) + C2 * (B.x - A.x)) / d,
        };
      })();
      x = A.x + B.x + C.x - 2 * O.x;
      y = A.y + B.y + C.y - 2 * O.y;
      break;
    }
  }
  setObject(state, { kind: 'point', id: step.id, x: round2(x), y: round2(y), label: step.label });
}

// ─── Circle creation ──────────────────────────────────────────────────────────

function solveCircleThroughPoint(step: StepCircleThroughPoint, state: State): void {
  const center = pt(state, step.center);
  const through = pt(state, step.through);
  const radius = Math.hypot(through.x - center.x, through.y - center.y);
  setObject(state, { kind: 'circle', id: step.id, center: step.center, radius, label: step.label });
}

function circumcenterOf(A: ResolvedPoint, B: ResolvedPoint, C: ResolvedPoint): { x: number; y: number; r: number } {
  const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  if (Math.abs(d) < 1e-9) throw new Error('circumcenter: triangle is degenerate');
  const A2 = A.x * A.x + A.y * A.y;
  const B2 = B.x * B.x + B.y * B.y;
  const C2 = C.x * C.x + C.y * C.y;
  const x = (A2 * (B.y - C.y) + B2 * (C.y - A.y) + C2 * (A.y - B.y)) / d;
  const y = (A2 * (C.x - B.x) + B2 * (A.x - C.x) + C2 * (B.x - A.x)) / d;
  const r = Math.hypot(x - A.x, y - A.y);
  return { x, y, r };
}

function solveCircleThroughThree(step: StepCircleThroughThree, state: State): void {
  const A = pt(state, step.points[0]);
  const B = pt(state, step.points[1]);
  const C = pt(state, step.points[2]);
  const cc = circumcenterOf(A, B, C);
  const centerId = `${step.id}_center`;
  setObject(state, { kind: 'point', id: centerId, x: round2(cc.x), y: round2(cc.y) });
  setObject(state, { kind: 'circle', id: step.id, center: centerId, radius: cc.r, label: step.label });
}

/** Inscribed circle of a triangle. Outputs:
 *  - circle with id `step.id` (the incircle itself)
 *  - point with id `${step.id}_center` (the incenter), or `centerId` override
 *  - three tangent-foot points T1, T2, T3 (override via tangentIds)
 */
function solveIncircle(step: StepIncircle, state: State): void {
  const A = pt(state, step.vertices[0]);
  const B = pt(state, step.vertices[1]);
  const C = pt(state, step.vertices[2]);
  // Side lengths opposite each vertex.
  const a = Math.hypot(B.x - C.x, B.y - C.y);
  const b = Math.hypot(C.x - A.x, C.y - A.y);
  const c = Math.hypot(A.x - B.x, A.y - B.y);
  const sum = a + b + c;
  if (sum < 1e-9) throw new Error(`incircle "${step.id}": triangle is degenerate`);
  const ix = (a * A.x + b * B.x + c * C.x) / sum;
  const iy = (a * A.y + b * B.y + c * C.y) / sum;
  // Inradius = area / semiperimeter. Use signed area / 2.
  const area = Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) / 2;
  const r = area / (sum / 2);
  // Tangent point on a side = foot of perpendicular from incenter to that side.
  const foot = (P: ResolvedPoint, Q: ResolvedPoint) => {
    const dx = Q.x - P.x;
    const dy = Q.y - P.y;
    const len2 = dx * dx + dy * dy || 1;
    const t = ((ix - P.x) * dx + (iy - P.y) * dy) / len2;
    return { x: P.x + t * dx, y: P.y + t * dy };
  };
  const fAB = foot(A, B);
  const fBC = foot(B, C);
  const fCA = foot(C, A);
  const centerId = step.centerId ?? `${step.id}_center`;
  const [tab, tbc, tca] = step.tangentIds ?? [`${step.id}_T1`, `${step.id}_T2`, `${step.id}_T3`];
  setObject(state, { kind: 'point', id: centerId, x: round2(ix), y: round2(iy) });
  setObject(state, { kind: 'point', id: tab, x: round2(fAB.x), y: round2(fAB.y) });
  setObject(state, { kind: 'point', id: tbc, x: round2(fBC.x), y: round2(fBC.y) });
  setObject(state, { kind: 'point', id: tca, x: round2(fCA.x), y: round2(fCA.y) });
  setObject(state, { kind: 'circle', id: step.id, center: centerId, radius: r, label: step.label });
}

/** Circumscribed circle of a triangle. Outputs:
 *  - circle with id `step.id`
 *  - point with id `${step.id}_center` (the circumcenter), or `centerId` override
 */
function solveCircumcircle(step: StepCircumcircle, state: State): void {
  const A = pt(state, step.vertices[0]);
  const B = pt(state, step.vertices[1]);
  const C = pt(state, step.vertices[2]);
  const cc = circumcenterOf(A, B, C);
  const centerId = step.centerId ?? `${step.id}_center`;
  setObject(state, { kind: 'point', id: centerId, x: round2(cc.x), y: round2(cc.y) });
  setObject(state, { kind: 'circle', id: step.id, center: centerId, radius: cc.r, label: step.label });
}

// ─── Tier 1 solvers ───────────────────────────────────────────────────────────

function solveRay(step: StepRay, state: State): void {
  const F = pt(state, step.from);
  const T = pt(state, step.toward);
  const dx = T.x - F.x;
  const dy = T.y - F.y;
  const m = Math.hypot(dx, dy) || 1;
  const len = step.length ?? Math.max(m * 2, 6);
  const endId = step.endId ?? `${step.id}_end`;
  setObject(state, {
    kind: 'point', id: endId,
    x: round2(F.x + (dx / m) * len),
    y: round2(F.y + (dy / m) * len),
  });
  setObject(state, { kind: 'segment', id: step.id, from: step.from, to: endId, label: step.label });
}

function solveAngleBisector(step: StepAngleBisector, state: State): void {
  const V = pt(state, step.vertex);
  const F = pt(state, step.from);
  const T = pt(state, step.to);
  const u1x = F.x - V.x, u1y = F.y - V.y;
  const u2x = T.x - V.x, u2y = T.y - V.y;
  const m1 = Math.hypot(u1x, u1y) || 1;
  const m2 = Math.hypot(u2x, u2y) || 1;
  const bx = u1x / m1 + u2x / m2;
  const by = u1y / m1 + u2y / m2;
  const bm = Math.hypot(bx, by) || 1;
  const len = step.length ?? Math.max(m1, m2);
  const endId = `${step.id}_end`;
  setObject(state, {
    kind: 'point', id: endId,
    x: round2(V.x + (bx / bm) * len),
    y: round2(V.y + (by / bm) * len),
  });
  setObject(state, { kind: 'segment', id: step.id, from: step.vertex, to: endId, label: step.label });
}

function solveExternalAngleBisector(step: StepExternalAngleBisector, state: State): void {
  const V = pt(state, step.vertex);
  const F = pt(state, step.from);
  const T = pt(state, step.to);
  const u1x = F.x - V.x, u1y = F.y - V.y;
  const u2x = T.x - V.x, u2y = T.y - V.y;
  const m1 = Math.hypot(u1x, u1y) || 1;
  const m2 = Math.hypot(u2x, u2y) || 1;
  // External bisector direction = difference of unit vectors (perpendicular
  // to the interior bisector).
  const bx = u1x / m1 - u2x / m2;
  const by = u1y / m1 - u2y / m2;
  const bm = Math.hypot(bx, by) || 1;
  const len = step.length ?? Math.max(m1, m2);
  const fromId = `${step.id}_from`;
  const toId = `${step.id}_to`;
  setObject(state, { kind: 'point', id: fromId, x: round2(V.x - (bx / bm) * len), y: round2(V.y - (by / bm) * len) });
  setObject(state, { kind: 'point', id: toId, x: round2(V.x + (bx / bm) * len), y: round2(V.y + (by / bm) * len) });
  setObject(state, { kind: 'segment', id: step.id, from: fromId, to: toId, label: step.label });
}

function solveSectionPoint(step: StepSectionPoint, state: State): void {
  let A: ResolvedPoint, B: ResolvedPoint;
  if (typeof step.of === 'string') {
    const seg = state.byId.get(step.of);
    if (!seg || seg.kind !== 'segment') throw new Error(`section_point: "${step.of}" is not a segment`);
    A = pt(state, seg.from); B = pt(state, seg.to);
  } else {
    A = pt(state, step.of.from); B = pt(state, step.of.to);
  }
  const [m, n] = step.ratio;
  const sum = m + n;
  if (sum === 0) throw new Error(`section_point "${step.id}": ratio sums to zero`);
  setObject(state, {
    kind: 'point', id: step.id,
    x: round2((n * A.x + m * B.x) / sum),
    y: round2((n * A.y + m * B.y) / sum),
    label: step.label,
  });
}

function solveReflectPoint(step: StepReflectPoint, state: State): void {
  const P = pt(state, step.point);
  const ln = resolveLineRef(state, step.across as LineRef);
  const dx = ln.bx - ln.ax;
  const dy = ln.by - ln.ay;
  const len2 = dx * dx + dy * dy || 1;
  const t = ((P.x - ln.ax) * dx + (P.y - ln.ay) * dy) / len2;
  const fx = ln.ax + t * dx;
  const fy = ln.ay + t * dy;
  setObject(state, {
    kind: 'point', id: step.id,
    x: round2(2 * fx - P.x),
    y: round2(2 * fy - P.y),
    label: step.label,
  });
}

function solveRotatePoint(step: StepRotatePoint, state: State): void {
  const P = pt(state, step.point);
  const C = pt(state, step.around);
  const r = (step.angle * Math.PI) / 180;
  const cos = Math.cos(r), sin = Math.sin(r);
  const dx = P.x - C.x, dy = P.y - C.y;
  setObject(state, {
    kind: 'point', id: step.id,
    x: round2(C.x + dx * cos - dy * sin),
    y: round2(C.y + dx * sin + dy * cos),
    label: step.label,
  });
}

function solveTranslatePoint(step: StepTranslatePoint, state: State): void {
  const P = pt(state, step.point);
  setObject(state, {
    kind: 'point', id: step.id,
    x: round2(P.x + step.by.dx),
    y: round2(P.y + step.by.dy),
    label: step.label,
  });
}

function solveDilatePoint(step: StepDilatePoint, state: State): void {
  const P = pt(state, step.point);
  const C = pt(state, step.about);
  setObject(state, {
    kind: 'point', id: step.id,
    x: round2(C.x + step.factor * (P.x - C.x)),
    y: round2(C.y + step.factor * (P.y - C.y)),
    label: step.label,
  });
}

function solveExcircle(step: StepExcircle, state: State): void {
  // Vertex order [A, B, C]. opposite chooses which excircle:
  //   'first'  → excircle opposite A (tangent to side BC)
  //   'second' → opposite B (tangent to AC)
  //   'third'  → opposite C (tangent to AB)
  const opp = step.opposite ?? 'first';
  const A = pt(state, step.vertices[0]);
  const B = pt(state, step.vertices[1]);
  const C = pt(state, step.vertices[2]);
  const a = Math.hypot(B.x - C.x, B.y - C.y);
  const b = Math.hypot(C.x - A.x, C.y - A.y);
  const c = Math.hypot(A.x - B.x, A.y - B.y);
  // Excenter formula: I_A = (-a·A + b·B + c·C) / (-a + b + c) and analogous.
  let wa: number, wb: number, wc: number;
  if (opp === 'first')      { wa = -a; wb =  b; wc =  c; }
  else if (opp === 'second'){ wa =  a; wb = -b; wc =  c; }
  else                       { wa =  a; wb =  b; wc = -c; }
  const sum = wa + wb + wc;
  if (Math.abs(sum) < 1e-9) throw new Error(`excircle "${step.id}": degenerate triangle`);
  const ex = (wa * A.x + wb * B.x + wc * C.x) / sum;
  const ey = (wa * A.y + wb * B.y + wc * C.y) / sum;
  const area = Math.abs((B.x - A.x) * (C.y - A.y) - (C.x - A.x) * (B.y - A.y)) / 2;
  const s = (a + b + c) / 2;
  const sMinus = opp === 'first' ? s - a : opp === 'second' ? s - b : s - c;
  const r = sMinus < 1e-9 ? area / 1e-9 : area / sMinus;
  // Tangent feet on each side line (foot of perpendicular from excenter).
  const foot = (P: ResolvedPoint, Q: ResolvedPoint) => {
    const dx = Q.x - P.x, dy = Q.y - P.y;
    const len2 = dx * dx + dy * dy || 1;
    const t = ((ex - P.x) * dx + (ey - P.y) * dy) / len2;
    return { x: P.x + t * dx, y: P.y + t * dy };
  };
  const fAB = foot(A, B);
  const fBC = foot(B, C);
  const fCA = foot(C, A);
  const centerId = step.centerId ?? `${step.id}_center`;
  const [tab, tbc, tca] = step.tangentIds ?? [`${step.id}_T1`, `${step.id}_T2`, `${step.id}_T3`];
  setObject(state, { kind: 'point', id: centerId, x: round2(ex), y: round2(ey) });
  setObject(state, { kind: 'point', id: tab, x: round2(fAB.x), y: round2(fAB.y) });
  setObject(state, { kind: 'point', id: tbc, x: round2(fBC.x), y: round2(fBC.y) });
  setObject(state, { kind: 'point', id: tca, x: round2(fCA.x), y: round2(fCA.y) });
  setObject(state, { kind: 'circle', id: step.id, center: centerId, radius: r, label: step.label });
}

function solveTangentsFromExternal(step: StepTangentsFromExternal, state: State): void {
  const c = circ(state, step.on);
  const center = pt(state, c.center);
  const E = pt(state, step.external);
  const dx = E.x - center.x, dy = E.y - center.y;
  const d = Math.hypot(dx, dy);
  if (d < c.radius - 1e-6) {
    throw new Error(`tangents_from_external "${step.id}": external point is inside the circle`);
  }
  const r = c.radius;
  const baseAngle = Math.atan2(dy, dx);
  const theta = Math.acos(Math.min(1, Math.max(-1, r / d)));
  const [segA, segB] = step.segmentIds ?? [`${step.id}_a`, `${step.id}_b`];
  const [touchA, touchB] = step.touchIds ?? [`${step.id}_touchA`, `${step.id}_touchB`];
  const aAngle = baseAngle + theta;
  const bAngle = baseAngle - theta;
  setObject(state, { kind: 'point', id: touchA, x: round2(center.x + r * Math.cos(aAngle)), y: round2(center.y + r * Math.sin(aAngle)) });
  setObject(state, { kind: 'point', id: touchB, x: round2(center.x + r * Math.cos(bAngle)), y: round2(center.y + r * Math.sin(bAngle)) });
  setObject(state, { kind: 'segment', id: segA, from: step.external, to: touchA, label: step.label });
  setObject(state, { kind: 'segment', id: segB, from: step.external, to: touchB });
}

function arcAnglesFor(step: { on: string; from: string; to: string; direction?: 'cw' | 'ccw' }, state: State): { center: string; radius: number; startAngle: number; endAngle: number } {
  const c = circ(state, step.on);
  const center = pt(state, c.center);
  const F = pt(state, step.from);
  const T = pt(state, step.to);
  const startAngle = Math.atan2(F.y - center.y, F.x - center.x) * 180 / Math.PI;
  let endAngle = Math.atan2(T.y - center.y, T.x - center.x) * 180 / Math.PI;
  // GeometryArc rendering sweeps from startAngle to endAngle. Normalize so
  // the requested direction is honored: for ccw (default) endAngle should
  // be > startAngle; for cw it should be < startAngle.
  const dir = step.direction ?? 'ccw';
  if (dir === 'ccw' && endAngle <= startAngle) endAngle += 360;
  if (dir === 'cw' && endAngle >= startAngle) endAngle -= 360;
  return { center: c.center, radius: c.radius, startAngle, endAngle };
}

function solveArc(step: StepArc, state: State): void {
  const { center, radius, startAngle, endAngle } = arcAnglesFor(step, state);
  setObject(state, { kind: 'arc', id: step.id, center, radius, startAngle, endAngle, label: step.label });
}

function solveSector(step: StepSector, state: State): void {
  const { center, radius, startAngle, endAngle } = arcAnglesFor(step, state);
  const centerPt = pt(state, center);
  const n = Math.max(8, step.arcSegments ?? 24);
  const verts: string[] = [];
  // The sector polygon: center + sampled arc points.
  const apexId = `${step.id}_apex`;
  setObject(state, { kind: 'point', id: apexId, x: centerPt.x, y: centerPt.y });
  verts.push(apexId);
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = (startAngle + (endAngle - startAngle) * t) * Math.PI / 180;
    const id = `${step.id}_arc${i}`;
    setObject(state, {
      kind: 'point', id,
      x: round2(centerPt.x + radius * Math.cos(a)),
      y: round2(centerPt.y + radius * Math.sin(a)),
    });
    verts.push(id);
  }
  setObject(state, { kind: 'polygon', id: step.id, vertices: verts, label: step.label });
}

// ─── Public entry point ───────────────────────────────────────────────────────

export interface SolverOutput {
  title?: string;
  points: GeometryPoint[];
  segments: GeometrySegment[];
  circles: GeometryCircle[];
  polygons: GeometryPolygon[];
  arcs: GeometryArc[];
  angles: GeometryAngle[];
  showGrid?: boolean;
  showAxes?: boolean;
  viewRange?: { x: [number, number]; y: [number, number] };
}

export function solveGeometry(spec: ConstructedGeometrySpec): SolverOutput {
  const state: State = { byId: new Map(), order: [] };

  // Two-pass given registration: points first, then everything that
  // references them. Brains naturally declare concept-first ("two
  // circles") before specifics ("with these centers"), so requiring
  // source-order forward declarations is brittle. The given array is
  // pure data — its order shouldn't matter as long as references
  // resolve.
  const givens = spec.given ?? [];
  for (const g of givens) {
    if (g.kind === 'point') {
      setObject(state, { kind: 'point', id: g.id, x: g.x, y: g.y, label: g.label });
    }
  }
  for (const g of givens) {
    switch (g.kind) {
      case 'point':
        // Already registered above.
        break;
      case 'circle':
        if (!state.byId.has(g.center)) {
          throw new Error(`circle "${g.id}": center "${g.center}" not declared`);
        }
        setObject(state, { kind: 'circle', id: g.id, center: g.center, radius: g.radius, label: g.label });
        break;
      case 'segment':
        setObject(state, {
          kind: 'segment', id: g.id,
          from: normalizePointRef(state, g.from, g.id, 'from'),
          to: normalizePointRef(state, g.to, g.id, 'to'),
          label: g.label,
        });
        break;
      case 'line':
        setObject(state, {
          kind: 'line', id: g.id,
          pointA: normalizePointRef(state, g.through[0], g.id, 'a'),
          pointB: normalizePointRef(state, g.through[1], g.id, 'b'),
          label: g.label,
        });
        break;
      case 'polygon':
        setObject(state, {
          kind: 'polygon', id: g.id,
          vertices: g.vertices.map((v, i) => normalizePointRef(state, v, g.id, `v${i}`)),
          label: g.label,
        });
        break;
    }
  }

  for (const step of spec.steps ?? []) {
    solveStep(step, state);
  }

  // Translate resolved objects into the GeometryRenderer-friendly shape.
  // Apply display-time labels / showCoords / showLength / colors.
  const display = spec.display ?? {};
  const labelOverrides = display.labels ?? {};
  const colorOverrides = display.colors ?? {};
  const showCoordsSet = new Set(display.showCoords ?? []);
  const showLengthSet = new Set(display.showLength ?? []);
  const dashedSet = new Set(display.dashed ?? []);

  const points: GeometryPoint[] = [];
  const segments: GeometrySegment[] = [];
  const arcs: GeometryArc[] = [];
  const circles: GeometryCircle[] = [];
  const polygons: GeometryPolygon[] = [];
  // Build a co-location set for labeled points so we can suppress the
  // unlabeled scaffolding dots (chord_from, chord_to, hex_v0, …) when
  // they sit on top of a brain-named point. Without this, the scaffolding
  // shows up as label-less blue dots adjacent to "P", "Q", "A" and reads
  // as a rendering artifact (image #23 / #24).
  const labeledKeys = new Set<string>();
  for (const obj of state.byId.values()) {
    if (obj.kind !== 'point') continue;
    const label = labelOverrides[obj.id] ?? obj.label ?? defaultPointLabel(obj.id);
    if (!label) continue;
    labeledKeys.add(`${roundForKey(obj.x)}|${roundForKey(obj.y)}`);
  }
  const isAutoScaffold = (id: string) =>
    /_{1,2}(from|to|end|touch|touchA|touchB|foot|center|apex|arc\d+|v\d+|e\d+|T\d+|a|b)$/.test(id);

  for (const id of state.order) {
    const obj = state.byId.get(id);
    if (!obj) continue;
    if (obj.kind === 'point') {
      const label = labelOverrides[obj.id] ?? obj.label ?? defaultPointLabel(obj.id);
      // Suppress an auto-scaffolding dot that coincides with a labeled point.
      if (!label && isAutoScaffold(obj.id)) {
        const k = `${roundForKey(obj.x)}|${roundForKey(obj.y)}`;
        if (labeledKeys.has(k)) continue;
      }
      points.push({
        id: obj.id,
        x: obj.x,
        y: obj.y,
        label,
        color: colorOverrides[obj.id],
        showCoords: showCoordsSet.has(obj.id) || undefined,
      });
    } else if (obj.kind === 'segment') {
      segments.push({
        from: obj.from,
        to: obj.to,
        label: labelOverrides[obj.id] ?? obj.label,
        color: colorOverrides[obj.id],
        showLength: showLengthSet.has(obj.id) || undefined,
        style: dashedSet.has(obj.id) ? 'dashed' : undefined,
      });
    } else if (obj.kind === 'circle') {
      circles.push({
        center: obj.center,
        radius: obj.radius,
        label: labelOverrides[obj.id] ?? obj.label,
        color: colorOverrides[obj.id],
      });
    } else if (obj.kind === 'polygon') {
      polygons.push({
        vertices: obj.vertices,
        label: labelOverrides[obj.id] ?? obj.label,
      });
    } else if (obj.kind === 'arc') {
      arcs.push({
        center: obj.center,
        radius: obj.radius,
        startAngle: obj.startAngle,
        endAngle: obj.endAngle,
        label: labelOverrides[obj.id] ?? obj.label,
        color: colorOverrides[obj.id],
      });
    }
    // Lines are not directly rendered — they're construction scaffolding.
    // If a brain wants a line drawn it should also emit a long segment.
  }

  return {
    title: spec.title,
    points,
    segments,
    circles,
    polygons,
    arcs,
    angles: [],
    // Axes and grid default ON. Brain forgets to set them on follow-up
    // turns and the resulting axisless figures are hard to read against
    // a coordinate plane backdrop. Brain can still opt out explicitly.
    showGrid: display.grid !== false,
    showAxes: display.axes !== false,
    viewRange: display.viewRange,
  };
}

// Convenience: derive a sensible label from the id when none is provided.
// Auto-generated child ids ("ch_from", "hex_v0") suppress the label —
// they're scaffolding, not user-facing names. Plain ids ("A", "O", "AB")
// pass through verbatim.
function defaultPointLabel(id: string): string | undefined {
  if (/_{1,2}(from|to|end|touch|touchA|touchB|foot|center|apex|arc\d+|v\d+|e\d+|T\d+|a|b)$/.test(id)) return undefined;
  return id;
}

function round2(n: number): number { return Math.round(n * 100) / 100; }

/** Rounded to 1dp for the colocation key — co-located dots shouldn't be
 *  considered "different" because of a 0.01-unit floating-point drift. */
function roundForKey(n: number): string { return (Math.round(n * 10) / 10).toFixed(1); }
