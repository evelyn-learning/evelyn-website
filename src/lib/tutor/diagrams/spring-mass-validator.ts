/**
 * Post-emit validator for show_spring_mass. Checks chain validity in
 * chain mode and physical sanity in single-mass mode. Catches:
 *   - Adjacent like-types (two walls, springs, or masses next to each
 *     other), which would render as a degenerate chain.
 *   - Missing or non-positive k / mass.
 *   - At least one wall anchor in chain mode (otherwise nothing fixes
 *     the chain in space).
 *   - Single-mass mode missing both k and mass.
 */

export interface SpringMassElement {
  type?: 'wall' | 'spring' | 'mass';
  k?: number;
  mass?: number;
  displacement?: number;
  naturalLength?: number;
  label?: string;
}

export interface SpringMassInput {
  elements?: SpringMassElement[];
  k?: number;
  mass?: number;
  displacement?: number;
}

export interface SpringMassValidationResult {
  ok: boolean;
  reason?: string;
}

function isPositiveFinite(n: unknown): boolean {
  return typeof n === 'number' && isFinite(n) && n > 0;
}

export function validateSpringMass(input: SpringMassInput): SpringMassValidationResult {
  const elements = Array.isArray(input.elements) ? input.elements : [];

  // Chain mode (preferred when elements is present).
  if (elements.length > 0) {
    if (elements.length < 3) {
      return {
        ok: false,
        reason: 'Chain mode needs at least 3 elements (e.g. wall, spring, mass). Re-emit a longer chain or use single-mass mode (pass k, mass, displacement instead of elements).',
      };
    }

    let wallCount = 0;
    let springCount = 0;
    let massCount = 0;

    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      const type = el.type;
      if (type !== 'wall' && type !== 'spring' && type !== 'mass') {
        return { ok: false, reason: `Element ${i + 1} has invalid type "${String(type)}". Each element\'s type must be "wall", "spring", or "mass".` };
      }
      if (type === 'wall') wallCount++;
      if (type === 'spring') {
        springCount++;
        if (!isPositiveFinite(el.k)) {
          return { ok: false, reason: `Spring at position ${i + 1} is missing a positive numeric k (N/m). Every spring needs a k value.` };
        }
      }
      if (type === 'mass') {
        massCount++;
        if (!isPositiveFinite(el.mass)) {
          return { ok: false, reason: `Mass at position ${i + 1} is missing a positive numeric mass (kg). Every mass element needs a mass value.` };
        }
      }
      // Adjacency check: no two consecutive elements of the same type.
      if (i > 0) {
        const prev = elements[i - 1].type;
        if (prev === type) {
          return {
            ok: false,
            reason: `Two consecutive ${type} elements at positions ${i} and ${i + 1}. The chain must alternate (a spring connects a wall/mass to a wall/mass; a mass sits between two springs or one spring and a wall).`,
          };
        }
      }
    }

    if (wallCount === 0) {
      return {
        ok: false,
        reason: 'A spring-mass chain needs at least one wall to anchor it. Re-emit with a wall on at least one end.',
      };
    }
    if (springCount === 0) {
      return { ok: false, reason: 'Chain has no springs. A spring-mass system needs at least one spring.' };
    }
    if (massCount === 0) {
      return { ok: false, reason: 'Chain has no masses. A spring-mass system needs at least one mass.' };
    }

    // Endpoints must be wall or mass (a spring as an endpoint dangles).
    const firstType = elements[0].type;
    const lastType = elements[elements.length - 1].type;
    if (firstType === 'spring') {
      return { ok: false, reason: 'Chain starts with a spring. The leftmost element must be a wall or a mass, otherwise the spring has nothing to anchor against.' };
    }
    if (lastType === 'spring') {
      return { ok: false, reason: 'Chain ends with a spring. The rightmost element must be a wall or a mass, otherwise the spring has nothing to anchor against.' };
    }

    return { ok: true };
  }

  // Single-mass mode.
  if (!isPositiveFinite(input.k)) {
    return { ok: false, reason: 'Single-mass mode requires a positive numeric `k` (spring constant in N/m). Re-emit with k > 0, or use chain mode by passing `elements`.' };
  }
  if (!isPositiveFinite(input.mass)) {
    return { ok: false, reason: 'Single-mass mode requires a positive numeric `mass` (kg). Re-emit with mass > 0, or use chain mode by passing `elements`.' };
  }

  return { ok: true };
}
