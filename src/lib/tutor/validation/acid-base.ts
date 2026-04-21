/**
 * Acid-base / pH validators.
 *
 * Covers the formulas students need in AP Chem and intro-level chemistry:
 *   - pH = -log10[H+]
 *   - pOH = -log10[OH-]
 *   - pH + pOH = 14   (at 25 °C)
 *   - Kw = [H+][OH-] = 1e-14
 *   - Ka × Kb = Kw  (conjugate pair)
 *   - Henderson-Hasselbalch: pH = pKa + log10([A-]/[HA])
 *   - Strong-acid / strong-base pH from concentration.
 */

const TOLERANCE = 0.05; // absolute tolerance on pH; equivalent to ~10% on [H+]

function close(a: number, b: number, tol = TOLERANCE): boolean {
  if (!isFinite(a) || !isFinite(b)) return false;
  return Math.abs(a - b) <= Math.max(tol, Math.abs(b) * 0.01);
}

export interface PhClaim {
  hConc?: number;    // [H+] in mol/L
  ohConc?: number;   // [OH-] in mol/L
  pH?: number;
  pOH?: number;
  temperature?: number; // in °C; default 25 for Kw = 1e-14
}

/**
 * Verify a pH / pOH / [H+] / [OH-] claim set is internally consistent.
 * If at least 2 of {hConc, pH, ohConc, pOH} are provided, we derive the
 * others and check against any given values.
 */
export function validatePhSet(claim: PhClaim): {
  correct: boolean;
  expected?: Partial<PhClaim>;
  issues?: string[];
} {
  const issues: string[] = [];
  const temp = claim.temperature ?? 25;
  // Kw varies with temp but for most teaching contexts 1e-14 at 25°C is correct.
  const Kw = temp >= 20 && temp <= 30 ? 1e-14 : 1e-14 * Math.pow(10, (temp - 25) * 0.03);
  const pKw = -Math.log10(Kw);

  // Derive everything from whatever's given.
  let hConc = claim.hConc;
  let ohConc = claim.ohConc;
  let pH = claim.pH;
  let pOH = claim.pOH;
  if (hConc === undefined && pH !== undefined) hConc = Math.pow(10, -pH);
  if (ohConc === undefined && pOH !== undefined) ohConc = Math.pow(10, -pOH);
  if (hConc !== undefined && ohConc === undefined) ohConc = Kw / hConc;
  if (ohConc !== undefined && hConc === undefined) hConc = Kw / ohConc;
  if (hConc !== undefined && pH === undefined) pH = -Math.log10(hConc);
  if (ohConc !== undefined && pOH === undefined) pOH = -Math.log10(ohConc);

  // Cross-check any provided values
  if (claim.pH !== undefined && pH !== undefined && !close(claim.pH, pH)) {
    issues.push(`pH claim ${claim.pH} inconsistent with derived ${pH.toFixed(3)}`);
  }
  if (claim.pOH !== undefined && pOH !== undefined && !close(claim.pOH, pOH)) {
    issues.push(`pOH claim ${claim.pOH} inconsistent with derived ${pOH.toFixed(3)}`);
  }
  if (pH !== undefined && pOH !== undefined && !close(pH + pOH, pKw, TOLERANCE * 2)) {
    issues.push(`pH + pOH = ${(pH + pOH).toFixed(3)} (should ≈ ${pKw.toFixed(3)} at ${temp}°C)`);
  }

  return {
    correct: issues.length === 0,
    expected: { hConc, ohConc, pH, pOH, temperature: temp },
    issues: issues.length ? issues : undefined,
  };
}

/**
 * Henderson-Hasselbalch check:
 *   pH = pKa + log10([A-] / [HA])
 */
export function validateHendersonHasselbalch(claim: {
  pH?: number;
  pKa?: number;
  aMinus?: number;
  hA?: number;
}): { correct: boolean; expected?: Partial<typeof claim>; issues?: string[] } {
  const { pH, pKa, aMinus, hA } = claim;
  if ([pH, pKa, aMinus, hA].filter(v => v === undefined).length !== 1) {
    return { correct: false, issues: ['Provide exactly 3 of {pH, pKa, aMinus, hA}; the 4th will be derived.'] };
  }
  let derived: Partial<typeof claim> = {};
  if (pH === undefined && pKa !== undefined && aMinus !== undefined && hA !== undefined && hA > 0) {
    derived.pH = pKa + Math.log10(aMinus / hA);
  } else if (pKa === undefined && pH !== undefined && aMinus !== undefined && hA !== undefined && hA > 0) {
    derived.pKa = pH - Math.log10(aMinus / hA);
  } else if (aMinus === undefined && pH !== undefined && pKa !== undefined && hA !== undefined) {
    derived.aMinus = hA * Math.pow(10, pH - pKa);
  } else if (hA === undefined && pH !== undefined && pKa !== undefined && aMinus !== undefined) {
    derived.hA = aMinus / Math.pow(10, pH - pKa);
  }
  return { correct: true, expected: derived };
}

/**
 * Strong-acid pH from concentration.
 * Assumes 100% dissociation → [H+] = concentration.
 */
export function strongAcidPh(molarity: number): number {
  if (molarity <= 0) return NaN;
  return -Math.log10(molarity);
}

/**
 * Strong-base pOH → pH via pOH conversion.
 */
export function strongBasePh(molarity: number): number {
  if (molarity <= 0) return NaN;
  const pOH = -Math.log10(molarity);
  return 14 - pOH;
}

/**
 * Verify a student's claim about a strong-acid or strong-base solution.
 */
export function validateStrongSolution(claim: {
  type: 'acid' | 'base';
  molarity: number;
  pH?: number;
}): { correct: boolean; expected: number; issues?: string[] } {
  const expected = claim.type === 'acid' ? strongAcidPh(claim.molarity) : strongBasePh(claim.molarity);
  if (claim.pH === undefined) return { correct: true, expected };
  const match = close(claim.pH, expected, TOLERANCE);
  return {
    correct: match,
    expected,
    issues: match ? undefined : [
      `${claim.molarity} M strong ${claim.type} has pH ≈ ${expected.toFixed(2)}, not ${claim.pH}`,
    ],
  };
}
