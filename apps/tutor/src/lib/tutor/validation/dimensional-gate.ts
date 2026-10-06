/**
 * When may `show_dimensional_check` run?
 *
 * 2026-10-05 (live, Algebra 1 portal-2c5340bd): on the student's own linear
 * equation `4(m+3)=2m-6` the brain called show_dimensional_check, the
 * validator read the variable `m` as MASS (validation/dimensional.ts
 * SYMBOLS), and the board showed "✗ dimensions mismatch 4(m+3)=2m-6 —
 * computed: 1 (dimensionless) expected: M". A wrong claim about a correct
 * equation, painted next to the problem.
 *
 * The check only means something when the letters ARE physical quantities.
 * So the call goes through only when BOTH hold:
 *   1. the session subject is a physical science (physics / chemistry /
 *      engineering, or a generic "science" session); and
 *   2. the checked text is about quantities with units: it names a
 *      recognised unit (`expectedUnit`, or a number followed by a unit such
 *      as "10 m/s^2"), or it is a purely symbolic formula ("F = m·a",
 *      "T = 2π√(L/g)") — no bare number is added to or subtracted from a
 *      symbol, which is what makes `m + 3` an algebra unknown and never a
 *      mass.
 * Otherwise the caller DROPS the call and the turn continues (the same soft
 * policy as an unresolved scroll target): the tutor's words carry the turn,
 * and no card is better than a false one.
 *
 * Pure; never throws.
 */
import { resolveToolSubjects } from '@/lib/tutor/ai/tool-subject-taxonomy';
import { TUTOR_DIMENSIONAL_CHECK_GATE } from '@/lib/tutor/orchestrator/turn-round-flags';

export type DimensionalGateDecision =
  | { allow: true }
  | { allow: false; reason: 'subject-not-physical' | 'no-units-or-quantities' | 'nothing-to-check' };

const PHYSICAL_SUBJECT_RE = /phys|chem|engineer|mechanic|electr|thermo|kinemat|astronom|\bscience\b|\bsci\b|stem\b/i;

/** Is this session about physical quantities? Uses the tool-subject resolver
 *  (the same mapping the brain's tool filter uses) and falls back to the
 *  subject / topic words when the resolver has no opinion. */
export function isPhysicalScienceSubject(subject?: string | null, topic?: string | null): boolean {
  let resolved: string[] | null = null;
  try { resolved = resolveToolSubjects(subject, topic); } catch { resolved = null; }
  if (resolved) return resolved.includes('physics') || resolved.includes('chemistry');
  return PHYSICAL_SUBJECT_RE.test(`${subject ?? ''} ${topic ?? ''}`);
}

/** Units the validator itself recognises (dimensional.ts UNIT_TO_DIM), plus
 *  the everyday multiples a tutor writes. */
const UNIT_TOKEN =
  '(?:m\\s*/\\s*s(?:\\s*\\^\\s*2|²)?|kg|g|mg|km|cm|mm|nm|m|s|ms|min|h|hr|N|J|kJ|W|kW|Pa|kPa|atm|Hz|V|Ω|ohms?|A|C|K|°\\s?[CFK]|mol|L|mL|eV|T)';
/** A number, a SPACE (or a TeX thin space / \\text{), then a unit: "10 m/s^2",
 *  "3 s". Without the space a letter after a digit is a coefficient ("2m"). */
const NUMBER_WITH_UNIT_RE = new RegExp(`\\d(?:\\s+|\\s*(?:\\\\,|\\\\ |\\\\text\\{|\\\\mathrm\\{)\\s*)${UNIT_TOKEN}(?![A-Za-z(])`);
const EXPECTED_UNIT_RE = new RegExp(`^\\s*${UNIT_TOKEN}(?:\\s*[·*/]\\s*${UNIT_TOKEN}(?:\\s*\\^\\s*-?\\d+)?)*\\s*$`);

/** A bare number added to / subtracted from something: `m + 3`, `2m - 6`,
 *  `3 + x`. That is an algebra equation in an unknown. */
const NUMERIC_ADDEND_RE = /(?:[+\-−]\s*\d+(?:\.\d+)?\s*(?:[)=+\-−]|$))|(?:(?:^|[(=])\s*\d+(?:\.\d+)?\s*[+\-−])/;

function plain(text: string): string {
  return (text || '')
    .replace(/\\(?:left|right|,|;|!|quad|qquad|displaystyle)/g, ' ')
    .replace(/\\(?:cdot|times)/g, '*')
    .replace(/[{}$]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** A formula in physical-quantity SYMBOLS only: has "=", two or more distinct
 *  letters, and no numeric addend. */
export function isSymbolicQuantityFormula(formula: string): boolean {
  const f = plain(formula);
  if (!f.includes('=')) return false;
  if (NUMERIC_ADDEND_RE.test(f)) return false;
  const letters = new Set((f.replace(/\\[a-zA-Z]+/g, ' ').match(/[A-Za-zΩωθφ]/g) ?? []));
  return letters.size >= 2;
}

export function carriesUnitTokens(args: { formula?: string; expression?: string; expectedUnit?: string; note?: string }): boolean {
  if (args.expectedUnit && EXPECTED_UNIT_RE.test(args.expectedUnit)) return true;
  return [args.formula, args.expression].some((t) => !!t && NUMBER_WITH_UNIT_RE.test(plain(t)));
}

export function decideDimensionalCheck(input: {
  /** Unset ⇒ TUTOR_DIMENSIONAL_CHECK_GATE. False ⇒ always allowed. */
  enabled?: boolean;
  subject?: string | null;
  topic?: string | null;
  formula?: string;
  expression?: string;
  expectedUnit?: string;
}): DimensionalGateDecision {
  try {
    if ((input?.enabled ?? TUTOR_DIMENSIONAL_CHECK_GATE) !== true) return { allow: true };
    const formula = typeof input.formula === 'string' ? input.formula : '';
    const expression = typeof input.expression === 'string' ? input.expression : '';
    if (!formula.trim() && !expression.trim()) return { allow: false, reason: 'nothing-to-check' };
    if (!isPhysicalScienceSubject(input.subject, input.topic)) return { allow: false, reason: 'subject-not-physical' };
    const expectedUnit = typeof input.expectedUnit === 'string' ? input.expectedUnit : undefined;
    // A bare number added to a symbol makes it an algebra unknown, whatever
    // else is named: `4(m+3) = 2m - 6` is never a statement about mass.
    if (formula.trim() && NUMERIC_ADDEND_RE.test(plain(formula)) && !NUMBER_WITH_UNIT_RE.test(plain(formula))) {
      return { allow: false, reason: 'no-units-or-quantities' };
    }
    if (carriesUnitTokens({ formula, expression, expectedUnit })) return { allow: true };
    if (formula.trim() && isSymbolicQuantityFormula(formula)) return { allow: true };
    return { allow: false, reason: 'no-units-or-quantities' };
  } catch {
    return { allow: true };
  }
}
