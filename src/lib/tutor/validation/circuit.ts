/**
 * Resistor-network solver for series/parallel combinations + Ohm's law.
 *
 * Not a full SPICE — we cover the 80% of intro circuits: series chains,
 * parallel branches, series-parallel nesting, Ohm's law (V=IR), and
 * Kirchhoff-voltage consistency on a single loop.
 *
 * Network is given as a nested structure:
 *   { type: "series", elements: [...] }
 *   { type: "parallel", elements: [...] }
 *   { type: "resistor", value: 10 }    // ohms
 *   { type: "source", voltage: 12 }    // volts (counted for V=IR)
 */

export type CircuitElement =
  | { type: 'resistor'; value: number; label?: string }
  | { type: 'source'; voltage: number; label?: string }
  | { type: 'series'; elements: CircuitElement[]; label?: string }
  | { type: 'parallel'; elements: CircuitElement[]; label?: string };

/** Compute the total resistance ignoring any voltage sources. */
export function resistanceOf(el: CircuitElement): number {
  switch (el.type) {
    case 'resistor': return el.value;
    case 'source': return 0;
    case 'series': return el.elements.reduce((sum, e) => sum + resistanceOf(e), 0);
    case 'parallel': {
      const inv = el.elements.reduce((sum, e) => {
        const r = resistanceOf(e);
        if (r === 0) return Infinity; // short
        return sum + 1 / r;
      }, 0);
      if (inv === Infinity) return 0;
      return inv === 0 ? Infinity : 1 / inv;
    }
  }
}

/** Sum the source voltages (treated as all adding in the same direction). */
export function totalSourceVoltage(el: CircuitElement): number {
  switch (el.type) {
    case 'source': return el.voltage;
    case 'resistor': return 0;
    case 'series': return el.elements.reduce((sum, e) => sum + totalSourceVoltage(e), 0);
    case 'parallel': {
      // Parallel sources are tricky; we assume the largest drives the branch.
      return Math.max(...el.elements.map(totalSourceVoltage));
    }
  }
}

/** Ohm's law: I = V/R. Returns NaN if resistance is 0 and voltage is nonzero. */
export function totalCurrent(network: CircuitElement): number {
  const V = totalSourceVoltage(network);
  const R = resistanceOf(network);
  if (R === 0) return V === 0 ? 0 : NaN;
  return V / R;
}

/** Verify a claimed total-resistance, total-current, or ohm's-law relationship. */
export function validateCircuitClaim(
  network: CircuitElement,
  claim: { totalResistance?: number; totalCurrent?: number; totalVoltage?: number },
): { correct: boolean; expected: { totalResistance: number; totalCurrent: number; totalVoltage: number }; issues?: string[] } {
  const expected = {
    totalResistance: resistanceOf(network),
    totalCurrent: totalCurrent(network),
    totalVoltage: totalSourceVoltage(network),
  };
  const issues: string[] = [];
  const tol = 0.05; // 5% relative tolerance
  const close = (a: number, b: number) => {
    if (!isFinite(a) || !isFinite(b)) return a === b;
    return Math.abs(a - b) <= Math.max(Math.abs(b) * tol, 0.01);
  };
  if (claim.totalResistance !== undefined && !close(claim.totalResistance, expected.totalResistance)) {
    issues.push(`Total resistance: claimed ${claim.totalResistance}Ω, actual ${expected.totalResistance.toFixed(3)}Ω`);
  }
  if (claim.totalCurrent !== undefined && !close(claim.totalCurrent, expected.totalCurrent)) {
    issues.push(`Total current: claimed ${claim.totalCurrent}A, actual ${expected.totalCurrent.toFixed(3)}A`);
  }
  if (claim.totalVoltage !== undefined && !close(claim.totalVoltage, expected.totalVoltage)) {
    issues.push(`Total voltage: claimed ${claim.totalVoltage}V, actual ${expected.totalVoltage.toFixed(3)}V`);
  }
  return { correct: issues.length === 0, expected, issues: issues.length ? issues : undefined };
}
