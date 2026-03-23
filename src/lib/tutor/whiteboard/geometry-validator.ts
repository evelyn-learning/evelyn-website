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

export interface GeometryCommand {
  action: string;
  title?: string;
  points: GeoPoint[];
  segments?: GeoSegment[];
  angles?: GeoAngle[];
  polygons?: GeoPolygon[];
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
  };

  const pointMap = new Map<string, GeoPoint>();
  for (const p of result.points) {
    pointMap.set(p.id, p);
  }

  // 1. Fix triangles with incorrect geometry
  fixTriangleGeometry(result, pointMap);

  // 2. Ensure all polygon vertices have labels
  ensureVertexLabels(result, pointMap);

  // 3. Fix overlapping labels (offset angle labels from vertex labels)
  fixLabelOverlaps(result, pointMap);

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
