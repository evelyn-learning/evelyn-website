/**
 * Post-emit validator for show_collision. Catches structural mistakes
 * the model occasionally makes — empty panels, missing masses, momentum
 * non-conservation in elastic collisions, mismatched dimensionality —
 * and returns a structured rejection the model can recover from.
 *
 * The model knows physics; we only check what's mechanically verifiable
 * from the netlist + the student's request.
 */

export interface CollisionBody {
  label?: string;
  mass?: number;
  velocity?: number;
  vx?: number;
  vy?: number;
  color?: string;
}

export interface CollisionInput {
  dimension?: '1D' | '2D';
  type?: 'elastic' | 'inelastic' | 'perfectly-inelastic';
  before?: CollisionBody[];
  after?: CollisionBody[];
}

export interface CollisionValidationResult {
  ok: boolean;
  reason?: string;
}

const MOMENTUM_EPSILON = 0.05; // 5% relative tolerance for elastic momentum check
const KE_EPSILON = 0.05;

function speedSquared(b: CollisionBody, dim: '1D' | '2D'): number {
  if (dim === '2D') {
    const x = b.vx ?? 0;
    const y = b.vy ?? 0;
    return x * x + y * y;
  }
  const v = b.velocity ?? 0;
  return v * v;
}

function momentum1D(b: CollisionBody): number {
  const m = b.mass ?? 0;
  return m * (b.velocity ?? 0);
}

function momentum2D(b: CollisionBody): { px: number; py: number } {
  const m = b.mass ?? 0;
  return { px: m * (b.vx ?? 0), py: m * (b.vy ?? 0) };
}

function approxEq(a: number, b: number, eps: number): boolean {
  const denom = Math.max(Math.abs(a), Math.abs(b), 1);
  return Math.abs(a - b) / denom <= eps;
}

export function validateCollision(input: CollisionInput): CollisionValidationResult {
  const before = Array.isArray(input.before) ? input.before : [];
  const after = Array.isArray(input.after) ? input.after : [];
  const dimension: '1D' | '2D' = input.dimension === '2D' ? '2D' : '1D';
  const type = input.type;

  if (before.length === 0) {
    return { ok: false, reason: 'show_collision was called with no `before` bodies. Re-emit with at least one body in `before`.' };
  }
  if (after.length === 0) {
    return { ok: false, reason: 'show_collision was called with no `after` bodies. Re-emit with at least one body in `after`.' };
  }

  // Every body needs a mass.
  for (const list of [before, after]) {
    for (const b of list) {
      if (typeof b.mass !== 'number' || !isFinite(b.mass) || b.mass <= 0) {
        return { ok: false, reason: 'Every body must have a positive numeric `mass`. Re-emit with masses on every body.' };
      }
    }
  }

  // Velocity-field consistency with the declared dimension.
  for (const list of [before, after]) {
    for (const b of list) {
      if (dimension === '1D') {
        if (typeof b.velocity !== 'number' || !isFinite(b.velocity)) {
          return { ok: false, reason: '1D collisions need a numeric signed `velocity` on every body (positive = right). Re-emit with `velocity` on each body.' };
        }
      } else {
        const hasVx = typeof b.vx === 'number' && isFinite(b.vx);
        const hasVy = typeof b.vy === 'number' && isFinite(b.vy);
        if (!hasVx && !hasVy) {
          return { ok: false, reason: '2D collisions need numeric `vx` and `vy` on every body. Re-emit with both components on each body.' };
        }
      }
    }
  }

  // Perfectly-inelastic must produce one body OR equal-velocity bodies.
  if (type === 'perfectly-inelastic') {
    if (after.length === 1) {
      // single combined body — fine
    } else {
      // All after bodies must move with the same velocity (within epsilon).
      const ref = after[0];
      for (let i = 1; i < after.length; i++) {
        const a = after[i];
        if (dimension === '1D') {
          if (!approxEq(a.velocity ?? 0, ref.velocity ?? 0, MOMENTUM_EPSILON)) {
            return { ok: false, reason: 'In a perfectly-inelastic collision the bodies stick together — every body in `after` must have the SAME final velocity. Re-emit with one combined body OR all bodies sharing the same velocity.' };
          }
        } else {
          if (!approxEq(a.vx ?? 0, ref.vx ?? 0, MOMENTUM_EPSILON) || !approxEq(a.vy ?? 0, ref.vy ?? 0, MOMENTUM_EPSILON)) {
            return { ok: false, reason: 'In a perfectly-inelastic collision the bodies stick together — every body in `after` must have the SAME final (vx, vy). Re-emit with one combined body OR all bodies sharing the same velocity.' };
          }
        }
      }
    }
  }

  // Momentum conservation — applies to ALL collision types.
  if (dimension === '1D') {
    const pBefore = before.reduce((s, b) => s + momentum1D(b), 0);
    const pAfter = after.reduce((s, b) => s + momentum1D(b), 0);
    if (!approxEq(pBefore, pAfter, MOMENTUM_EPSILON)) {
      return {
        ok: false,
        reason: `Momentum is not conserved: Σmv before = ${pBefore.toFixed(2)}, Σmv after = ${pAfter.toFixed(2)}. Re-emit so the total momentum matches before vs after.`,
      };
    }
  } else {
    const pB = before.reduce((s, b) => { const p = momentum2D(b); return { px: s.px + p.px, py: s.py + p.py }; }, { px: 0, py: 0 });
    const pA = after.reduce((s, b) => { const p = momentum2D(b); return { px: s.px + p.px, py: s.py + p.py }; }, { px: 0, py: 0 });
    if (!approxEq(pB.px, pA.px, MOMENTUM_EPSILON) || !approxEq(pB.py, pA.py, MOMENTUM_EPSILON)) {
      return {
        ok: false,
        reason: `Momentum is not conserved component-wise: before = (${pB.px.toFixed(2)}, ${pB.py.toFixed(2)}), after = (${pA.px.toFixed(2)}, ${pA.py.toFixed(2)}). Re-emit so px and py both match.`,
      };
    }
  }

  // Elastic: kinetic energy must also be conserved.
  if (type === 'elastic') {
    const keBefore = before.reduce((s, b) => s + 0.5 * (b.mass ?? 0) * speedSquared(b, dimension), 0);
    const keAfter = after.reduce((s, b) => s + 0.5 * (b.mass ?? 0) * speedSquared(b, dimension), 0);
    if (!approxEq(keBefore, keAfter, KE_EPSILON)) {
      return {
        ok: false,
        reason: `For an elastic collision, kinetic energy must also be conserved. Σ½mv² before = ${keBefore.toFixed(2)}, after = ${keAfter.toFixed(2)}. Either fix the after-velocities or change \`type\` to "inelastic".`,
      };
    }
  }

  return { ok: true };
}
