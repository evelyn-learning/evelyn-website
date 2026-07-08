/**
 * Geometry Command Validator & Post-Processor
 *
 * Validates and fixes showGeometry commands before rendering.
 * Catches common issues from AI-generated geometry:
 *   - Scalene triangles with equal sides
 *   - Label overlaps (vertex labels colliding with angle labels)
 *   - Vertices placed outside viewable area
 *   - Missing vertex labels
 *
 * This runs as a post-processor on whiteboard commands, NOT as prompt rules.
 */

interface GeoPoint {
  id: string;
  x: number;
  y: number;
  label?: string;
  showCoords?: boolean;
  color?: string;
}

interface GeoSegment {
  from: string;
  to: string;
  label?: string;
  tickMarks?: number;
  style?: string;
  color?: string;
}

interface GeoAngle {
  vertex: string;
  from: string;
  to: string;
  label?: string;
  style?: string;
  color?: string;
}

interface GeoPolygon {
  vertices: string[];
  fill?: string;
  stroke?: string;
  label?: string;
}

interface GeoCircle {
  center: string;
  radius: number;
  style?: string;
  color?: string;
  label?: string;
}

export interface GeometryCommand {
  action: string;
  title?: string;
  points: GeoPoint[];
  segments?: GeoSegment[];
  angles?: GeoAngle[];
  polygons?: GeoPolygon[];
  circles?: GeoCircle[];
  /**
   * Set by the validator when the command's title declares a shape whose
   * primitives are missing or insufficient (e.g. title says "triangle" but
   * only 1 point is provided). The command consumer should skip rendering
   * rather than draw a nonsensical partial shape.
   */
  _incomplete?: boolean;
  /** Reason the command was marked incomplete — for logs / debug surface. */
  _incompleteReason?: string;
  [key: string]: unknown;
}

// ── Helpers ──

function dist(a: GeoPoint, b: GeoPoint): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Try to parse the numeric value out of a length-like label such as
 * "5", "√13", "sqrt(13)", "b = √13", "AB = 4". Returns null when the
 * label is not interpretable as a length (e.g. plain "AB", "side a",
 * "angle θ"), so we leave those untouched.
 */
function parseLengthLabel(label: string): number | null {
  if (!label) return null;
  const cleaned = label.trim();
  // Take the rightmost expression after a "=" if present, e.g. "b = √13"
  // → "√13". This handles the LLM's occasional "AB = 5" style.
  const afterEq = cleaned.includes('=') ? cleaned.split('=').pop()!.trim() : cleaned;
  // sqrt(N) or sqrt N
  const sqrtFn = afterEq.match(/^sqrt\s*\(?\s*(\d+(?:\.\d+)?)\s*\)?$/i);
  if (sqrtFn) return Math.sqrt(parseFloat(sqrtFn[1]));
  // √N
  const sqrtSym = afterEq.match(/^√\s*(\d+(?:\.\d+)?)$/);
  if (sqrtSym) return Math.sqrt(parseFloat(sqrtSym[1]));
  // Plain number (possibly decimal)
  const num = afterEq.match(/^-?\d+(?:\.\d+)?$/);
  if (num) return parseFloat(afterEq);
  return null;
}

/**
 * Format a numeric distance as a clean length label. Uses the integer
 * form when possible, an exact √N form when the squared value is a
 * positive integer, and a 2dp decimal otherwise.
 */
function formatLengthLabel(value: number): string {
  if (value <= 0) return String(round2(value));
  if (Number.isInteger(value)) return String(value);
  const squared = value * value;
  const roundedSq = Math.round(squared);
  if (Math.abs(squared - roundedSq) < 1e-6 && roundedSq > 0) {
    return `√${roundedSq}`;
  }
  return String(round2(value));
}

/**
 * If a point's label embeds explicit coordinates like "A(3, 6)" but the
 * point's actual x/y disagree, rewrite the label to match the coords. The
 * brain (Sonnet 4.6) reliably gets the geometry right but sometimes writes
 * off-by-one coordinate text — observed 2026-04-26 with circle center O(3,2)
 * radius 5 where A was emitted at (3,7) labeled "A(3,6)" and B at (8,2)
 * labeled "B(7,2)". The visual position is correct; only the label text was
 * stale. Labels that don't embed a (number, number) tuple are left alone.
 */
function fixPointCoordLabels(cmd: GeometryCommand): void {
  const re = /\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)/;
  for (const p of cmd.points || []) {
    if (!p.label) continue;
    const m = p.label.match(re);
    if (!m) continue;
    const labelX = parseFloat(m[1]);
    const labelY = parseFloat(m[2]);
    if (!Number.isFinite(labelX) || !Number.isFinite(labelY)) continue;
    const matchesX = Math.abs(labelX - p.x) < 1e-6;
    const matchesY = Math.abs(labelY - p.y) < 1e-6;
    if (matchesX && matchesY) continue;
    // Format coordinates the way the LLM tends to: integers when whole,
    // otherwise round to 2 decimal places (mirrors round2 elsewhere).
    const fmt = (n: number) => (Number.isInteger(n) ? String(n) : String(round2(n)));
    p.label = p.label.replace(re, `(${fmt(p.x)}, ${fmt(p.y)})`);
  }
}

/**
 * Recompute segment-length labels from the actual point coordinates.
 * If the label parses as a length and disagrees with the computed
 * distance by more than 1%, replace it with the correct value. Labels
 * that aren't length-like (e.g. "side a", "AB", or empty) are left as-is.
 */
function fixSegmentLengthLabels(cmd: GeometryCommand, pointMap: Map<string, GeoPoint>): void {
  const segments = cmd.segments || [];
  for (const seg of segments) {
    if (!seg.label) continue;
    const a = pointMap.get(seg.from);
    const b = pointMap.get(seg.to);
    if (!a || !b) continue;
    // Preserve a leading prefix like "b = " so the label stays in its
    // original form (the LLM often uses "side-name = value"). We rewrite
    // only the value part.
    const eqIdx = seg.label.indexOf('=');
    const prefix = eqIdx >= 0 ? seg.label.slice(0, eqIdx + 1) + ' ' : '';
    const valuePart = eqIdx >= 0 ? seg.label.slice(eqIdx + 1).trim() : seg.label.trim();
    const claimed = parseLengthLabel(valuePart);
    if (claimed === null) continue;  // Not a length label — leave alone.
    const actual = dist(a, b);
    if (actual === 0) continue;
    if (Math.abs(claimed - actual) / actual <= 0.01) continue;  // Within 1%, OK.
    const corrected = formatLengthLabel(actual);
    seg.label = prefix + corrected;
  }
}

/**
 * Validate and fix a showGeometry command.
 * Returns the (possibly modified) command.
 */
export function validateGeometryCommand(cmd: GeometryCommand): GeometryCommand {
  if (cmd.action !== 'showGeometry' || !cmd.points?.length) return cmd;

  // Clone to avoid mutating the original
  const result: GeometryCommand = {
    ...cmd,
    points: cmd.points.map(p => ({ ...p })),
    segments: cmd.segments?.map(s => ({ ...s })),
    angles: cmd.angles?.map(a => ({ ...a })),
    polygons: cmd.polygons?.map(p => ({ ...p })),
    circles: cmd.circles?.map(c => ({ ...c })),
  };

  const pointMap = new Map<string, GeoPoint>();
  for (const p of result.points) {
    pointMap.set(p.id, p);
  }

  // 1. Fix triangles with incorrect geometry
  fixTriangleGeometry(result, pointMap);

  // 1b. Recompute segment-length labels from coordinates. Catches bugs
  // like Sonnet labeling BC = √5 when the actual distance is √13. We
  // trust the points (which the model usually gets right) over the
  // labels (which it sometimes computes wrong).
  fixSegmentLengthLabels(result, pointMap);

  // 1c. Same idea for point-label coordinate text: if a point at (3,7) is
  // labeled "A(3,6)" the visual is correct but the text reads wrong.
  fixPointCoordLabels(result);

  // 2. Ensure all polygon vertices have labels
  ensureVertexLabels(result, pointMap);

  // 3. Fix overlapping labels (offset angle labels from vertex labels)
  fixLabelOverlaps(result, pointMap);

  // 4. If the title announces a shape ("circle", "triangle", etc.) but the
  //    corresponding array is empty, synthesize a reasonable default so the
  //    student actually sees the shape. This catches the #1 class of rendering
  //    bug: LLM writes `title: "Circle with Chord"` + points + segments but
  //    forgets the `circles` array — the renderer draws nothing circular.
  ensureTitleShapeExists(result, pointMap);

  // 5. Enforce declared geometric invariants. If the LLM labels a segment
  //    "Chord", both endpoints must sit on the associated circle; if it labels
  //    one "Altitude", its foot must be the perpendicular projection onto the
  //    base; and so on. These checks correct the drawing even when the LLM
  //    provided the primary shape but got the secondary geometry wrong.
  enforceGeometricInvariants(result, pointMap);

  // 6. Flag commands whose title announces a shape that isn't actually
  //    represented in the data (e.g. "Triangle with Altitude" but only 1
  //    point). The caller checks `_incomplete` and skips rendering rather
  //    than drawing a nonsensical partial shape.
  flagIncompleteShapes(result);

  return result;
}

/**
 * Detect triangles and validate their geometry matches their title/description.
 * If a "scalene" triangle has equal sides, adjust coordinates.
 * If an "isosceles" triangle doesn't have two equal sides, adjust.
 * If an "equilateral" triangle doesn't have all equal sides, adjust.
 */
function fixTriangleGeometry(cmd: GeometryCommand, pointMap: Map<string, GeoPoint>): void {
  const title = (cmd.title || '').toLowerCase();

  // Find triangle polygons (3 vertices)
  const trianglePolygons = (cmd.polygons || []).filter(p => p.vertices.length === 3);

  // Also detect implicit triangles from 3-point segments forming a cycle
  const implicitTriangles = detectImplicitTriangles(cmd.segments || [], pointMap);

  const allTriangles = [
    ...trianglePolygons.map(p => p.vertices),
    ...implicitTriangles,
  ];

  for (const vertexIds of allTriangles) {
    const pts = vertexIds.map(id => pointMap.get(id)).filter(Boolean) as GeoPoint[];
    if (pts.length !== 3) continue;

    const [a, b, c] = pts;
    const ab = round2(dist(a, b));
    const bc = round2(dist(b, c));
    const ca = round2(dist(c, a));
    const sides = [ab, bc, ca].sort((x, y) => x - y);

    // Check if sides match the declared type
    if (title.includes('scalene')) {
      // Scalene: all sides must be different
      if (sides[0] === sides[1] || sides[1] === sides[2]) {
        fixScaleneTriangle(pts, pointMap);
      }
    } else if (title.includes('equilateral')) {
      // Equilateral: all sides must be equal
      if (sides[0] !== sides[2]) {
        fixEquilateralTriangle(pts, pointMap);
      }
    } else if (title.includes('isosceles') && !title.includes('scalene')) {
      // Isosceles: exactly two sides equal
      const hasEqual = sides[0] === sides[1] || sides[1] === sides[2];
      const allEqual = sides[0] === sides[2];
      if (!hasEqual || allEqual) {
        fixIsoscelesTriangle(pts, pointMap);
      }
    }
  }
}

/**
 * Detect implicit triangles: find 3 points connected by exactly 3 segments forming a cycle.
 */
function detectImplicitTriangles(segments: GeoSegment[], pointMap: Map<string, GeoPoint>): string[][] {
  if (segments.length < 3) return [];

  // Build adjacency
  const adj = new Map<string, Set<string>>();
  for (const seg of segments) {
    if (!adj.has(seg.from)) adj.set(seg.from, new Set());
    if (!adj.has(seg.to)) adj.set(seg.to, new Set());
    adj.get(seg.from)!.add(seg.to);
    adj.get(seg.to)!.add(seg.from);
  }

  const triangles: string[][] = [];
  const seen = new Set<string>();
  const nodes = Array.from(adj.keys());

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      for (let k = j + 1; k < nodes.length; k++) {
        const a = nodes[i], b = nodes[j], c = nodes[k];
        if (
          adj.get(a)?.has(b) && adj.get(b)?.has(c) && adj.get(c)?.has(a) &&
          pointMap.has(a) && pointMap.has(b) && pointMap.has(c)
        ) {
          const key = [a, b, c].sort().join(',');
          if (!seen.has(key)) {
            seen.add(key);
            triangles.push([a, b, c]);
          }
        }
      }
    }
  }

  return triangles;
}

/**
 * Fix a scalene triangle so all sides are visibly different.
 * Preserves the centroid and general shape but adjusts one vertex.
 */
function fixScaleneTriangle(pts: GeoPoint[], pointMap: Map<string, GeoPoint>): void {
  const [a, b, c] = pts;

  // Keep A and B, adjust C to create distinct sides
  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const baseLen = dist(a, b);

  // Move C to be offset from midpoint, creating asymmetry
  const newC = pointMap.get(c.id);
  if (!newC) return;

  // If C is on the perpendicular bisector of AB (making isosceles), shift it
  const perpX = -(b.y - a.y);
  const perpY = (b.x - a.x);
  const perpLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;

  // Place C at ~70% of base height, offset 25% from midpoint
  newC.x = round2(midX + (perpX / perpLen) * baseLen * 0.7 + baseLen * 0.15);
  newC.y = round2(midY + (perpY / perpLen) * baseLen * 0.7 + baseLen * 0.1);
}

/**
 * Fix an equilateral triangle so all sides are equal.
 * Keeps A and B, moves C to the correct position.
 */
function fixEquilateralTriangle(pts: GeoPoint[], pointMap: Map<string, GeoPoint>): void {
  const [a, b, c] = pts;
  const newC = pointMap.get(c.id);
  if (!newC) return;

  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const baseLen = dist(a, b);

  // Height of equilateral triangle
  const h = (Math.sqrt(3) / 2) * baseLen;

  // Perpendicular direction from AB
  const perpX = -(b.y - a.y);
  const perpY = (b.x - a.x);
  const perpLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;

  // Determine which side C should be on (preserve original intent)
  const origSide = (c.x - midX) * perpX + (c.y - midY) * perpY;
  const sign = origSide >= 0 ? 1 : -1;

  newC.x = round2(midX + sign * (perpX / perpLen) * h);
  newC.y = round2(midY + sign * (perpY / perpLen) * h);
}

/**
 * Fix an isosceles triangle so exactly two sides are equal.
 * Keeps A and B (base), moves C to the perpendicular bisector.
 */
function fixIsoscelesTriangle(pts: GeoPoint[], pointMap: Map<string, GeoPoint>): void {
  const [a, b, c] = pts;
  const newC = pointMap.get(c.id);
  if (!newC) return;

  const midX = (a.x + b.x) / 2;
  const midY = (a.y + b.y) / 2;
  const baseLen = dist(a, b);

  // Perpendicular direction from AB
  const perpX = -(b.y - a.y);
  const perpY = (b.x - a.x);
  const perpLen = Math.sqrt(perpX * perpX + perpY * perpY) || 1;

  // Height: use 80% of base for a visible isosceles shape
  const h = baseLen * 0.8;

  // Determine which side C should be on
  const origSide = (c.x - midX) * perpX + (c.y - midY) * perpY;
  const sign = origSide >= 0 ? 1 : -1;

  newC.x = round2(midX + sign * (perpX / perpLen) * h);
  newC.y = round2(midY + sign * (perpY / perpLen) * h);
}

/**
 * Ensure all vertices in polygons and segment endpoints have labels.
 */
function ensureVertexLabels(cmd: GeometryCommand, pointMap: Map<string, GeoPoint>): void {
  // Collect all point IDs that participate in polygons or segments
  const usedIds = new Set<string>();

  for (const poly of (cmd.polygons || [])) {
    for (const id of poly.vertices) usedIds.add(id);
  }
  for (const seg of (cmd.segments || [])) {
    usedIds.add(seg.from);
    usedIds.add(seg.to);
  }

  // Ensure each used point has a label
  for (const id of usedIds) {
    const pt = pointMap.get(id);
    if (pt && !pt.label) {
      pt.label = id; // Use ID as fallback label
    }
  }
}

/**
 * Detect and fix label overlaps between vertex labels and angle labels.
 */
function fixLabelOverlaps(cmd: GeometryCommand, pointMap: Map<string, GeoPoint>): void {
  if (!cmd.angles?.length) return;

  for (const angle of cmd.angles) {
    if (!angle.label) continue;

    const vertex = pointMap.get(angle.vertex);
    if (!vertex?.label) continue;

    // Case 1: Vertex label already contains angle info (e.g., "A (90°)" with angle "90°")
    // → Remove the redundant angle label
    if (vertex.label.includes(angle.label)) {
      angle.label = '';
      continue;
    }

    // Case 2: Angle label contains the vertex label (e.g., angle "A = 90°" with vertex "A")
    if (angle.label.includes(vertex.label)) {
      // Strip the vertex name from the angle label to reduce overlap
      angle.label = angle.label.replace(vertex.label, '').replace(/^\s*[=:]\s*/, '').trim();
      continue;
    }

    // Case 3: Vertex label has angle info embedded (e.g., "A (90°)")
    // → Clean vertex label to just the ID, keep angle label
    const angleInVertex = vertex.label.match(/\(([^)]*°[^)]*)\)/);
    if (angleInVertex) {
      vertex.label = vertex.label.replace(/\s*\([^)]*°[^)]*\)/, '').trim();
    }
  }
}

/**
 * If the title (or an existing label) announces a shape that isn't actually
 * represented in the command's data, synthesize a sensible default so the
 * student sees the shape instead of bare points.
 *
 * Currently handles:
 *   - "circle" in title with empty `circles` array → add a circle centered on
 *     a plausible center point (ids like "O", "center", "C") with a radius
 *     derived from the farthest labeled point, or a sensible default radius.
 *
 * This is a rendering-layer safety net, not a pedagogical one — it keeps the
 * whiteboard visually honest when the LLM forgets the shape primitive.
 */
function ensureTitleShapeExists(cmd: GeometryCommand, pointMap: Map<string, GeoPoint>): void {
  const title = (cmd.title || '').toLowerCase();

  const mentionsCircle = /\bcircle\b/.test(title);
  const hasCircle = Array.isArray(cmd.circles) && cmd.circles.length > 0;

  if (mentionsCircle && !hasCircle) {
    // Find a plausible center point. Preference order:
    //   1. A point labeled "O" or "Center" (common tutor convention)
    //   2. A point with id matching /center|origin|^o$/i
    //   3. The centroid of all points
    const byLabel = cmd.points.find(p => {
      const label = (p.label || p.id || '').toLowerCase();
      return label === 'o' || label === 'center' || label === 'origin' || label.includes('center');
    });

    let centerId: string | undefined;
    if (byLabel) {
      centerId = byLabel.id;
    } else if (cmd.points.length > 0) {
      // Use the centroid as a synthesized center
      const cx = cmd.points.reduce((s, p) => s + p.x, 0) / cmd.points.length;
      const cy = cmd.points.reduce((s, p) => s + p.y, 0) / cmd.points.length;
      const synthId = '_circle_center';
      if (!pointMap.has(synthId)) {
        const synthPoint: GeoPoint = {
          id: synthId,
          x: round2(cx),
          y: round2(cy),
          label: 'O',
          color: '#94a3b8',
        };
        cmd.points.push(synthPoint);
        pointMap.set(synthId, synthPoint);
      }
      centerId = synthId;
    }

    if (!centerId) return;

    const center = pointMap.get(centerId)!;
    // Radius: use the mean distance from center to other labeled points,
    // clamped to a visible range. Default to 3 if no other points exist.
    const otherPts = cmd.points.filter(p => p.id !== centerId);
    let radius = 3;
    if (otherPts.length > 0) {
      const mean = otherPts.reduce((s, p) => s + dist(center, p), 0) / otherPts.length;
      if (mean > 0.1) radius = round2(mean);
    }

    cmd.circles = [
      ...(cmd.circles || []),
      { center: centerId, radius, color: '#4f8cff', style: 'solid' },
    ];

    // If there's a chord segment whose endpoints don't sit on the circle,
    // snap them to the circle so the chord visibly terminates on the boundary.
    if (Array.isArray(cmd.segments)) {
      for (const seg of cmd.segments) {
        const from = pointMap.get(seg.from);
        const to = pointMap.get(seg.to);
        if (!from || !to) continue;
        // Don't snap the radius segment itself (center-to-point)
        if (seg.from === centerId || seg.to === centerId) continue;
        snapPointToCircle(from, center, radius);
        snapPointToCircle(to, center, radius);
      }
    }
  }
}

/**
 * Move a point onto the circle of a given center/radius, preserving its
 * angular direction from the center. If the point coincides with the center,
 * place it to the right (angle 0).
 *
 * The right rule for "should we snap?" is:
 *   - If the brain set showCoords on this point, those exact coords are
 *     visible to the student. Snapping silently would make the displayed
 *     numbers disagree with the rendered position (the prior bug class
 *     where (-5.5, 0.5) was rewritten to (-5.54, 0.54) on screen).
 *   - Otherwise we should snap generously. Sonnet's circle-arithmetic is
 *     routinely off by 1-5% (e.g. picks 3.165 when the right y is 3.330);
 *     leaving those errors in produces visible inconsistencies — most
 *     painfully showLength on a "radius" segment that reports 4.86 when
 *     the brain claimed the segment is a radius of length 5.
 *
 * So: skip if showCoords is set, otherwise snap up to 12% of radius. The
 * 12% bound preserves intentionally-interior points (something at the
 * centroid of a small triangle, for example) while catching realistic
 * math errors.
 */
function snapPointToCircle(pt: GeoPoint, center: GeoPoint, radius: number): void {
  const dx = pt.x - center.x;
  const dy = pt.y - center.y;
  const d = Math.sqrt(dx * dx + dy * dy);
  if (d < 1e-6) {
    pt.x = round2(center.x + radius);
    pt.y = round2(center.y);
    return;
  }
  const err = Math.abs(d - radius);
  if (err < 0.05) return;                          // already on circle (FP noise only)
  if (pt.showCoords) return;                       // brain owns the displayed coords
  if (err > 0.12 * radius) return;                 // clearly intentional, not a math slip
  pt.x = round2(center.x + (dx / d) * radius);
  pt.y = round2(center.y + (dy / d) * radius);
}

/**
 * Place a chord on a circle while preserving the chord's length and direction
 * (not just the angles of its endpoints). Used when the brain explicitly
 * labels a segment "chord" but emits endpoints that are inside the circle —
 * a common failure mode where the brain computes the half-chord length
 * correctly but forgets that the chord midpoint sits at perpendicular
 * distance from the center, not at the center.
 *
 * Independent radial snapping (the previous behavior) would preserve each
 * endpoint's angular direction from center, but for points on the same
 * diameter line through O it produces the FULL diameter — destroying the
 * student-facing length the brain was trying to communicate. This routine
 * preserves |AB| and the chord's direction, then chooses whichever of the
 * two valid on-circle positions is closer to where the brain placed it.
 *
 * Returns true if the chord was repositioned, false if no fix applied
 * (caller can fall back to per-endpoint snapping for "almost on circle"
 * cases that don't need a full chord-aware repositioning).
 */
function snapChordToCircle(
  from: GeoPoint,
  to: GeoPoint,
  center: GeoPoint,
  radius: number,
): boolean {
  if (from.showCoords || to.showCoords) return false; // brain owns coords
  const chordLen = Math.hypot(to.x - from.x, to.y - from.y);
  if (chordLen < 1e-6) return false;                  // degenerate
  if (chordLen > 2 * radius) return false;            // impossible chord on this circle
  const dxFrom = from.x - center.x;
  const dyFrom = from.y - center.y;
  const dxTo = to.x - center.x;
  const dyTo = to.y - center.y;
  const dFrom = Math.hypot(dxFrom, dyFrom);
  const dTo = Math.hypot(dxTo, dyTo);
  const errFrom = Math.abs(dFrom - radius);
  const errTo = Math.abs(dTo - radius);
  // If both endpoints are already close to on-circle, fall through to
  // per-endpoint radial snap (handles small math slips correctly).
  if (errFrom < 0.05 && errTo < 0.05) return false;
  if (errFrom < 0.12 * radius && errTo < 0.12 * radius) return false;
  // Direction along the chord (from → to).
  const ux = (to.x - from.x) / chordLen;
  const uy = (to.y - from.y) / chordLen;
  // Perpendicular distance from center for a chord of this length.
  const half = chordLen / 2;
  const h = Math.sqrt(Math.max(0, radius * radius - half * half));
  // Two candidate midpoints, one on each side of the chord line through O.
  const perpX = -uy;
  const perpY = ux;
  const cand = [
    [center.x + h * perpX, center.y + h * perpY],
    [center.x - h * perpX, center.y - h * perpY],
  ];
  const brainMidX = (from.x + to.x) / 2;
  const brainMidY = (from.y + to.y) / 2;
  // Choose the candidate midpoint closer to the brain's intended midpoint.
  // If the brain placed the chord through the center (M ≈ O), both
  // candidates are equidistant; deterministic tiebreaker is the +perp side.
  const d0 = Math.hypot(brainMidX - cand[0][0], brainMidY - cand[0][1]);
  const d1 = Math.hypot(brainMidX - cand[1][0], brainMidY - cand[1][1]);
  const [mx, my] = d0 <= d1 ? cand[0] : cand[1];
  from.x = round2(mx - half * ux);
  from.y = round2(my - half * uy);
  to.x = round2(mx + half * ux);
  to.y = round2(my + half * uy);
  return true;
}

// ─── Geometric invariants ────────────────────────────────────────────────────

/**
 * Inspect segment labels for geometric-role keywords ("chord", "diameter",
 * "radius", "altitude", "median", "perpendicular") and enforce the declared
 * relationship by snapping points. This runs AFTER ensureTitleShapeExists —
 * so the circle (or other target shape) is always present by this point.
 *
 * Operates unconditionally: if a segment is labeled as a chord, both endpoints
 * MUST sit on the circle, regardless of who drew the circle (LLM or us).
 * This is the fix for "LLM provided the circle but picked bad chord endpoints".
 */
function enforceGeometricInvariants(cmd: GeometryCommand, pointMap: Map<string, GeoPoint>): void {
  const segments = cmd.segments || [];
  const circles = cmd.circles || [];

  // Implicit radii. Any segment with one endpoint at a circle's center is
  // structurally a radius — the other endpoint should sit on the circle.
  // The brain often labels these "OC" / "OD" rather than "radius", so the
  // label-keyword rules below don't fire. Without this pass, showLength
  // on those segments computes against off-circle coords and reports
  // "OC = 4.86" while the brain narrates "OC is a radius, so OC = 5".
  for (const seg of segments) {
    for (const circle of circles) {
      const isFromCenter = seg.from === circle.center;
      const isToCenter = seg.to === circle.center;
      if (!isFromCenter && !isToCenter) continue;
      const center = pointMap.get(circle.center);
      const otherId = isFromCenter ? seg.to : seg.from;
      const other = pointMap.get(otherId);
      if (!center || !other) continue;
      snapPointToCircle(other, center, circle.radius);
      break;
    }
  }

  for (const seg of segments) {
    const label = (seg.label || '').toLowerCase();
    if (!label) continue;

    // Chord: both endpoints lie on the circle. We snap them onto the circle
    // (defensive — the LLM sometimes picks endpoints that are 0.1 off radius)
    // but do NOT rotate "diameter-like" chords away from the center. A
    // diameter IS a chord, and when the user explicitly says "chord from
    // (-3, 4) to (3, -4)" they mean exactly those endpoints. The previous
    // 40° rotation silently turned the user's correct (3, -4) into ~(5, -1)
    // and made the rendered chord visibly miss the origin.
    if (/\bchord\b/.test(label) && circles.length > 0) {
      const circle = pickCircleForSegment(seg, circles, pointMap);
      if (!circle) continue;
      const center = pointMap.get(circle.center);
      if (!center) continue;
      const from = pointMap.get(seg.from);
      const to = pointMap.get(seg.to);
      if (!from || !to) continue;
      // First try chord-aware repositioning (preserves length + direction).
      // Fires when both endpoints are well off the circle — the brain
      // typically gets this wrong by forgetting perpendicular distance and
      // emitting a chord that runs through the center.
      const repositioned = snapChordToCircle(from, to, center, circle.radius);
      if (!repositioned) {
        // Endpoints are close to on-circle already — small math slips. Per-
        // endpoint radial snap handles these without changing chord length.
        snapPointToCircle(from, center, circle.radius);
        snapPointToCircle(to, center, circle.radius);
      }
      continue;
    }

    // Diameter: passes through center; endpoints diametrically opposite.
    if (/\bdiameter\b/.test(label) && circles.length > 0) {
      const circle = pickCircleForSegment(seg, circles, pointMap);
      if (!circle) continue;
      const center = pointMap.get(circle.center);
      if (!center) continue;
      const from = pointMap.get(seg.from);
      const to = pointMap.get(seg.to);
      if (!from || !to) continue;
      snapPointToCircle(from, center, circle.radius);
      // Mirror the other endpoint through the center.
      to.x = round2(2 * center.x - from.x);
      to.y = round2(2 * center.y - from.y);
      continue;
    }

    // Radius: one endpoint is the center, the other lies on the circle.
    if (/\bradius\b/.test(label) && circles.length > 0) {
      const circle = pickCircleForSegment(seg, circles, pointMap);
      if (!circle) continue;
      const center = pointMap.get(circle.center);
      if (!center) continue;
      const from = pointMap.get(seg.from);
      const to = pointMap.get(seg.to);
      if (!from || !to) continue;
      // The endpoint that matches the circle's center stays; snap the other.
      if (seg.from === circle.center) snapPointToCircle(to, center, circle.radius);
      else if (seg.to === circle.center) snapPointToCircle(from, center, circle.radius);
      else {
        // Neither endpoint is the declared center. Snap `from` to the center
        // and `to` to the circle, preserving `to`'s angular direction.
        from.x = round2(center.x);
        from.y = round2(center.y);
        snapPointToCircle(to, center, circle.radius);
      }
      continue;
    }

    // Altitude / perpendicular: project the starting vertex onto the base
    // segment, and set the foot point (the other endpoint) to the projection.
    if (/\baltitude\b/.test(label) || /\bperpendicular\b/.test(label)) {
      enforcePerpendicularSegment(seg, segments, pointMap);
      continue;
    }

    // Median: foot at the midpoint of the "opposite" segment (the base).
    if (/\bmedian\b/.test(label)) {
      const base = findBaseForVertex(seg, segments, pointMap);
      if (!base) continue;
      const baseFrom = pointMap.get(base.from);
      const baseTo = pointMap.get(base.to);
      if (!baseFrom || !baseTo) continue;
      // The foot is the endpoint of `seg` that is NOT the apex vertex.
      const apex = pickApex(seg, base);
      const footId = seg.from === apex ? seg.to : seg.from;
      const foot = pointMap.get(footId);
      if (!foot) continue;
      foot.x = round2((baseFrom.x + baseTo.x) / 2);
      foot.y = round2((baseFrom.y + baseTo.y) / 2);
      continue;
    }
  }
}

/**
 * For altitude / perpendicular segments: project the "apex" (the endpoint
 * that is NOT on the base) onto the base line, then move the "foot" endpoint
 * to that projection. The result is a segment that is exactly perpendicular
 * to the base and whose foot lies on the base segment.
 */
function enforcePerpendicularSegment(
  seg: GeoSegment,
  allSegments: GeoSegment[],
  pointMap: Map<string, GeoPoint>
): void {
  const base = findBaseForVertex(seg, allSegments, pointMap);
  if (!base) return;
  const baseFrom = pointMap.get(base.from);
  const baseTo = pointMap.get(base.to);
  if (!baseFrom || !baseTo) return;

  const apex = pickApex(seg, base);
  const footId = seg.from === apex ? seg.to : seg.from;
  const apexPt = pointMap.get(apex);
  const footPt = pointMap.get(footId);
  if (!apexPt || !footPt) return;

  // Project apexPt onto the line baseFrom → baseTo.
  const dx = baseTo.x - baseFrom.x;
  const dy = baseTo.y - baseFrom.y;
  const lenSq = dx * dx + dy * dy;
  if (lenSq < 1e-9) return;
  const t = ((apexPt.x - baseFrom.x) * dx + (apexPt.y - baseFrom.y) * dy) / lenSq;
  // Clamp so the foot lies on the segment, not past its endpoints.
  const tClamped = Math.max(0, Math.min(1, t));
  footPt.x = round2(baseFrom.x + tClamped * dx);
  footPt.y = round2(baseFrom.y + tClamped * dy);
}

/**
 * Find the "base" segment for an altitude/median/perpendicular: the segment
 * connecting the two triangle vertices that are NOT the apex of the cevian.
 * Heuristic: among all segments, pick the one whose endpoints are both
 * different from the cevian's "apex" endpoint (the one that isn't the foot).
 */
function findBaseForVertex(
  cevian: GeoSegment,
  allSegments: GeoSegment[],
  pointMap: Map<string, GeoPoint>
): GeoSegment | null {
  // Try both orientations — whichever endpoint of the cevian could be the apex.
  for (const candidateApex of [cevian.from, cevian.to]) {
    for (const s of allSegments) {
      if (s === cevian) continue;
      if (s.from === candidateApex || s.to === candidateApex) continue;
      // Both endpoints of `s` must exist.
      if (pointMap.has(s.from) && pointMap.has(s.to)) return s;
    }
  }
  return null;
}

/** Decide which endpoint of the cevian is the apex vs. the foot. */
function pickApex(cevian: GeoSegment, base: GeoSegment): string {
  // The apex is the endpoint of `cevian` that is NOT shared with `base`.
  const baseEndpoints = new Set([base.from, base.to]);
  if (!baseEndpoints.has(cevian.from)) return cevian.from;
  if (!baseEndpoints.has(cevian.to)) return cevian.to;
  // Both endpoints on the base — degenerate; default to `from`.
  return cevian.from;
}

/**
 * When multiple circles exist, pick the one most relevant to this segment.
 * Preference: circle whose bounding interval covers both endpoints, else
 * the first. For now we just return the first — most diagrams have one.
 */
function pickCircleForSegment(
  _seg: GeoSegment,
  circles: GeoCircle[],
  _pointMap: Map<string, GeoPoint>
): GeoCircle | null {
  return circles[0] || null;
}

// ─── Incomplete-shape detection ──────────────────────────────────────────────

/**
 * If the command's title announces a shape ("triangle", "quadrilateral",
 * "pentagon", "hexagon") but the command's data doesn't actually contain
 * that shape (not enough points, or no polygon/segments forming the shape),
 * mark the command as `_incomplete` so the caller skips rendering. This
 * catches the class of LLM bug where a tool call is emitted with partial
 * args — the frequent cause of "two drawings appeared, the first was broken".
 */
function flagIncompleteShapes(cmd: GeometryCommand): void {
  const title = (cmd.title || '').toLowerCase();
  const nPoints = cmd.points.length;
  const nSegments = cmd.segments?.length ?? 0;
  const nPolygons = cmd.polygons?.length ?? 0;

  // Degenerate content — nothing but anonymous dots. A showGeometry with
  // NO segments/polygons/circles/angles whose points carry no label and
  // no coordinate readout renders as a titled card containing bare dots
  // (observed live 2026-07-08, session portal-9549e3af: title "Two-Way
  // Table Structure" + one unlabeled point at the origin — the brain
  // tried to sketch a TABLE via show_geometry). Whatever the intent,
  // there is nothing for the student to see; refuse so the brain retries
  // with real primitives or the right tool. Title-independent on purpose:
  // the polygon rules below only catch shapes the title names.
  const nCircles = cmd.circles?.length ?? 0;
  const nAngles = cmd.angles?.length ?? 0;
  if (nSegments + nPolygons + nCircles + nAngles === 0) {
    const anyVisibleInfo = cmd.points.some((p) => (p.label ?? '').trim() !== '' || p.showCoords === true);
    if (!anyVisibleInfo) {
      cmd._incomplete = true;
      cmd._incompleteReason =
        `The command contains only ${nPoints} unlabeled point(s) and no segments/polygons/circles/angles — it would render as a bare dot with nothing to see. ` +
        'If you meant tabular data (a two-way / frequency / comparison table), use show_table instead; otherwise re-emit with the full figure primitives.';
      return;
    }
  }

  const requirement: Array<{ keyword: RegExp; minPoints: number; needsFigure: boolean }> = [
    { keyword: /\btriangle\b/, minPoints: 3, needsFigure: true },
    { keyword: /\bquadrilateral\b|\brectangle\b|\bsquare\b|\bparallelogram\b|\brhombus\b|\btrapezoid\b/, minPoints: 4, needsFigure: true },
    { keyword: /\bpentagon\b/, minPoints: 5, needsFigure: true },
    { keyword: /\bhexagon\b/, minPoints: 6, needsFigure: true },
    { keyword: /\boctagon\b/, minPoints: 8, needsFigure: true },
  ];

  for (const req of requirement) {
    if (!req.keyword.test(title)) continue;
    if (nPoints < req.minPoints) {
      cmd._incomplete = true;
      cmd._incompleteReason = `Title announces a polygon requiring ${req.minPoints} points, but only ${nPoints} were provided.`;
      return;
    }
    if (req.needsFigure && nPolygons === 0 && nSegments < req.minPoints) {
      cmd._incomplete = true;
      cmd._incompleteReason = `Title announces a polygon, but no polygon entry and fewer than ${req.minPoints} segments were provided.`;
      return;
    }
  }

  // "circle with chord" — need a circle and at least two points for the chord
  if (/\bcircle\b.*\bchord\b/.test(title) || /\bchord\b/.test(title)) {
    if ((cmd.circles?.length ?? 0) === 0 && nPoints < 2) {
      cmd._incomplete = true;
      cmd._incompleteReason = 'Title mentions a chord but no circle and fewer than 2 points were provided.';
    }
  }
}
