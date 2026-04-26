/**
 * Post-emit validator for show_energy_bars. Catches structural mistakes
 * that produce nonsensical bar charts: empty positions, negative
 * energies (KE/PE/spring can't be negative; thermal must be ≥0), and
 * thermal-monotonicity (heat dissipated cannot decrease as the system
 * progresses through positions).
 */

export interface EnergyBarsPosition {
  label: string;
  ke?: number;
  pe?: number;
  spring?: number;
  thermal?: number;
}

export interface EnergyBarsInput {
  positions?: EnergyBarsPosition[];
}

export interface EnergyBarsValidationResult {
  ok: boolean;
  reason?: string;
}

const NEG_EPSILON = 1e-6;

function isNonNegative(v: number | undefined): boolean {
  if (v === undefined || v === null) return true;
  if (typeof v !== 'number' || !isFinite(v)) return false;
  return v >= -NEG_EPSILON;
}

export function validateEnergyBars(input: EnergyBarsInput): EnergyBarsValidationResult {
  const positions = Array.isArray(input.positions) ? input.positions : [];

  if (positions.length === 0) {
    return { ok: false, reason: 'show_energy_bars was called with no positions. Re-emit with at least one position column.' };
  }

  // Each position needs a label and at least one non-zero energy term.
  for (let i = 0; i < positions.length; i++) {
    const p = positions[i];
    if (typeof p.label !== 'string' || !p.label.trim()) {
      return { ok: false, reason: `Position ${i + 1} is missing a non-empty label. Every column needs a short label like "Top", "Bottom", or "Before collision".` };
    }
    const hasNonZero =
      (p.ke ?? 0) !== 0 || (p.pe ?? 0) !== 0 || (p.spring ?? 0) !== 0 || (p.thermal ?? 0) !== 0;
    if (!hasNonZero) {
      return { ok: false, reason: `Position "${p.label}" has all-zero energy (ke/pe/spring/thermal). At least one component must be non-zero.` };
    }
  }

  // KE, spring PE, and thermal-loss are conventionally non-negative.
  // PE is allowed to be negative when the prompt explicitly chooses a
  // reference where the system descends below it (e.g. "use the cliff
  // edge as PE = 0; pit bottom is below"). Rejecting negative PE
  // outright forces the brain to pick a different reference even when
  // the student asked for one — so we only reject KE/spring/thermal.
  for (const p of positions) {
    for (const k of ['ke', 'spring', 'thermal'] as const) {
      const v = p[k];
      if (v !== undefined && !isNonNegative(v)) {
        return {
          ok: false,
          reason: `Position "${p.label}" has a negative ${k} (${v}). KE, spring PE, and thermal energy cannot be negative — they're not reference-relative. Re-emit with ${k} ≥ 0.`,
        };
      }
    }
    // PE: allowed below zero, but reject NaN / non-finite.
    if (p.pe !== undefined && (typeof p.pe !== 'number' || !isFinite(p.pe))) {
      return {
        ok: false,
        reason: `Position "${p.label}" has a non-finite pe (${p.pe}). Use a real number; PE may be negative when the reference height is above the system's current position.`,
      };
    }
  }

  // Thermal energy can only accumulate (never decrease) across successive
  // positions in a one-way scenario. If thermal drops, that's a sign error
  // or an out-of-order positions list.
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1].thermal ?? 0;
    const curr = positions[i].thermal ?? 0;
    if (curr < prev - NEG_EPSILON) {
      return {
        ok: false,
        reason: `Thermal energy decreased from position "${positions[i - 1].label}" (${prev}) to "${positions[i].label}" (${curr}). Heat dissipated by friction cannot decrease over time. Re-emit with non-decreasing thermal values across positions.`,
      };
    }
  }

  return { ok: true };
}
