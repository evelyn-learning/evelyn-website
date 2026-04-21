/**
 * Numeric-claims validator for geometry figures.
 *
 * Given a rendered geometry command (points, segments, angles), verify
 * spoken claims like:
 *   - "Side AB = 5"
 *   - "Angle at A is 60°"
 *   - "Area of triangle ABC is 12"
 *
 * We extract these claims from tutor transcript text, compute the true
 * value from the point coordinates, and flag mismatches beyond tolerance.
 */

interface Point { id?: string; x: number; y: number; label?: string }

export interface NumericClaim {
  kind: 'distance' | 'angle' | 'area';
  labels: string[];        // e.g. ["A","B"] for distance, ["A"] or ["B","A","C"] for angle, ["A","B","C"] for area
  value: number;            // numeric value from claim
  unit?: string;            // "degrees" | "radians" | plain
}

// Parse "side AB = 5" / "|AB| = 5" / "AB = 3 units" / "distance from A to B is 4"
const DISTANCE_PATTERNS = [
  /\b(?:side|segment|length of|length|distance from|\|)?\s*([A-Z])\s*([A-Z])\s*[|]?\s*(?:=|is|equals?)\s*(-?\d+(?:\.\d+)?)/,
  /\bdistance\s+from\s+([A-Z])\s+to\s+([A-Z])\s+(?:is|=|equals?)\s+(-?\d+(?:\.\d+)?)/i,
];

// Parse "angle at A = 60°" / "∠A = 60" / "angle BAC is 90"
const ANGLE_PATTERNS = [
  /\bangle\s+(?:at\s+)?([A-Z])(?:[A-Z]([A-Z]))?\s*(?:=|is|equals?)\s*(-?\d+(?:\.\d+)?)\s*(?:°|degrees?)?/i,
  /∠\s*([A-Z])(?:([A-Z])([A-Z]))?\s*(?:=|is|equals?)\s*(-?\d+(?:\.\d+)?)/,
];

// Parse "area of triangle ABC = 12" / "area is 15"
const AREA_PATTERN =
  /\barea\s+of\s+(?:triangle\s+)?([A-Z])([A-Z])([A-Z])\s*(?:=|is|equals?)\s*(-?\d+(?:\.\d+)?)/i;

export function extractNumericClaims(text: string): NumericClaim[] {
  if (!text) return [];
  const claims: NumericClaim[] = [];

  // Distance claims
  for (const pat of DISTANCE_PATTERNS) {
    const m = text.match(pat);
    if (m) {
      const a = m[1]; const b = m[2]; const val = parseFloat(m[3]);
      if (a && b && !isNaN(val)) {
        claims.push({ kind: 'distance', labels: [a, b], value: val });
      }
    }
  }

  // Angle claims. "angle at A" is ambiguous without the two rays; we still
  // record and let the caller match against whichever angle has vertex A.
  const angleAt = text.match(/\bangle\s+at\s+([A-Z])\s*(?:=|is|equals?)\s*(-?\d+(?:\.\d+)?)/i);
  if (angleAt) {
    claims.push({ kind: 'angle', labels: [angleAt[1]], value: parseFloat(angleAt[2]) });
  }
  const angleBAC = text.match(/\bangle\s+([A-Z])([A-Z])([A-Z])\s*(?:=|is|equals?)\s*(-?\d+(?:\.\d+)?)/i);
  if (angleBAC) {
    claims.push({ kind: 'angle', labels: [angleBAC[1], angleBAC[2], angleBAC[3]], value: parseFloat(angleBAC[4]) });
  }

  // Area
  const area = text.match(AREA_PATTERN);
  if (area) {
    claims.push({ kind: 'area', labels: [area[1], area[2], area[3]], value: parseFloat(area[4]) });
  }

  return claims;
}

function findPoint(points: Point[], label: string): Point | null {
  // Label can be either `id` or `label`; try both.
  return points.find(p => p.id === label || p.label === label) || null;
}

function dist(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function angleAtVertex(vertex: Point, a: Point, b: Point): number {
  // Returns angle at `vertex` formed by rays to a and b, in degrees.
  const v1x = a.x - vertex.x, v1y = a.y - vertex.y;
  const v2x = b.x - vertex.x, v2y = b.y - vertex.y;
  const dot = v1x * v2x + v1y * v2y;
  const mag = Math.hypot(v1x, v1y) * Math.hypot(v2x, v2y);
  if (mag === 0) return 0;
  return Math.acos(Math.max(-1, Math.min(1, dot / mag))) * 180 / Math.PI;
}

function triangleArea(a: Point, b: Point, c: Point): number {
  // Shoelace formula, absolute value.
  return Math.abs((a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y)) / 2);
}

/**
 * Verify a claim against geometry point data. Tolerance defaults to 5%
 * relative (or 0.1 absolute, whichever is larger) to accommodate student
 * approximations and renderer rounding.
 */
export function verifyNumericClaim(
  claim: NumericClaim,
  points: Point[],
  opts: { tolerance?: number } = {},
): { correct: boolean; actual: number | null; issues?: string[] } {
  const tolerance = opts.tolerance ?? 0.05;
  let actual: number | null = null;

  if (claim.kind === 'distance') {
    const [a, b] = claim.labels;
    const pa = findPoint(points, a);
    const pb = findPoint(points, b);
    if (!pa || !pb) return { correct: false, actual: null, issues: [`Point(s) ${a}/${b} not found.`] };
    actual = dist(pa, pb);
  } else if (claim.kind === 'angle') {
    if (claim.labels.length === 3) {
      const [a, v, b] = claim.labels;
      const pa = findPoint(points, a); const pv = findPoint(points, v); const pb = findPoint(points, b);
      if (!pa || !pv || !pb) return { correct: false, actual: null, issues: [`Angle points not found.`] };
      actual = angleAtVertex(pv, pa, pb);
    } else if (claim.labels.length === 1) {
      // Only vertex given — find two other points with shortest connection to the vertex.
      const [v] = claim.labels;
      const pv = findPoint(points, v);
      if (!pv) return { correct: false, actual: null, issues: [`Vertex ${v} not found.`] };
      const neighbors = points
        .filter(p => p !== pv && (p.id || p.label))
        .sort((a, b) => dist(pv, a) - dist(pv, b))
        .slice(0, 2);
      if (neighbors.length < 2) return { correct: false, actual: null };
      actual = angleAtVertex(pv, neighbors[0], neighbors[1]);
    }
  } else if (claim.kind === 'area') {
    const [a, b, c] = claim.labels;
    const pa = findPoint(points, a); const pb = findPoint(points, b); const pc = findPoint(points, c);
    if (!pa || !pb || !pc) return { correct: false, actual: null, issues: [`Triangle points not found.`] };
    actual = triangleArea(pa, pb, pc);
  }

  if (actual === null) return { correct: false, actual: null };
  const tol = Math.max(Math.abs(actual) * tolerance, 0.1);
  const match = Math.abs(actual - claim.value) <= tol;
  return {
    correct: match,
    actual,
    issues: match ? undefined : [
      `${claim.kind} ${claim.labels.join('')}: claimed ${claim.value}, actual ≈ ${actual.toFixed(2)}`,
    ],
  };
}
