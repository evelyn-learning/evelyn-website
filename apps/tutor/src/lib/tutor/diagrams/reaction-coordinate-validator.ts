/**
 * Post-emit validator for show_reaction_coordinate. Catches structural
 * errors that produce nonsensical energy profiles: missing/empty
 * activation energies, negative Ea, Ea below the higher of reactants
 * or products (the transition state can't sit below the surrounding
 * baselines), and curve_labels length mismatch.
 */

export interface ReactionCoordinateInput {
  reactants_energy?: number;
  products_energy?: number;
  activation_energies?: number[];
  curve_labels?: string[];
}

export interface ReactionCoordinateValidationResult {
  ok: boolean;
  reason?: string;
}

const TS_FLOOR_EPSILON = 1e-6;

export function validateReactionCoordinate(
  input: ReactionCoordinateInput,
): ReactionCoordinateValidationResult {
  const reactantsE = typeof input.reactants_energy === 'number' && isFinite(input.reactants_energy)
    ? input.reactants_energy
    : 0;
  const productsE = input.products_energy;
  const eas = Array.isArray(input.activation_energies) ? input.activation_energies : [];
  const labels = Array.isArray(input.curve_labels) ? input.curve_labels : [];

  if (typeof productsE !== 'number' || !isFinite(productsE)) {
    return { ok: false, reason: 'show_reaction_coordinate requires a numeric `products_energy`. Re-emit with a finite number.' };
  }

  if (eas.length === 0) {
    return { ok: false, reason: 'show_reaction_coordinate requires at least one activation energy. Pass `activation_energies: [Ea]` for a single curve.' };
  }

  // Each Ea must be a finite non-negative number.
  for (let i = 0; i < eas.length; i++) {
    const ea = eas[i];
    if (typeof ea !== 'number' || !isFinite(ea)) {
      return { ok: false, reason: `activation_energies[${i}] is not a finite number. Each entry must be a non-negative number representing the activation barrier height.` };
    }
    if (ea < 0) {
      return { ok: false, reason: `activation_energies[${i}] is negative (${ea}). Activation energy is a barrier height and must be ≥ 0.` };
    }
  }

  // Transition state height (reactants + Ea) must sit at or above the
  // higher of the two baselines. Otherwise the "barrier" is below the
  // products and there's no actual barrier to cross.
  const baseline = Math.max(reactantsE, productsE);
  for (let i = 0; i < eas.length; i++) {
    const tsHeight = reactantsE + eas[i];
    if (tsHeight < baseline - TS_FLOOR_EPSILON) {
      return {
        ok: false,
        reason: `Curve ${i + 1}: the transition-state height (reactants_energy + Ea = ${tsHeight}) is below the products_energy (${productsE}). The activation barrier must rise above both reactants and products. Increase Ea so the transition state is at least max(reactants, products).`,
      };
    }
  }

  // curve_labels — if provided, length must match activation_energies.
  if (labels.length > 0 && labels.length !== eas.length) {
    return {
      ok: false,
      reason: `curve_labels has ${labels.length} entries but activation_energies has ${eas.length}. Provide one label per curve, or omit curve_labels entirely.`,
    };
  }

  return { ok: true };
}
