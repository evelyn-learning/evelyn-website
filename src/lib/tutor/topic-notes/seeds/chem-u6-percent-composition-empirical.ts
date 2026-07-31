/**
 * Chemistry — Unit 6.3: Percent Composition & Empirical Formulas.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u6-percent-composition-empirical.ts
 * (planId evelyn.hs.chem.percent-composition-empirical.v1).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.percent-composition-empirical';

export const BASELINE_CHEM_U6_PERCENT_COMPOSITION_EMPIRICAL: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.percent-composition-empirical.v1',
  course: 'Chemistry',
  cedUnit: 6,
  cedTopic: '6.3',
  cedTitle: 'Percent Composition & Empirical Formulas',
  planId: 'evelyn.hs.chem.percent-composition-empirical.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.percent-composition-empirical.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'formula',
      title: 'Percent composition',
      content:
        'For each element: (mass of that element in one mole of the compound ÷ molar mass of the compound) × 100. In H₂O the hydrogen mass is 2(1.0) = 2.0 out of 18.0, so H is 11.1% and O is 88.9%. The percents must total 100.',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Empirical versus molecular formula',
      content:
        'The empirical formula is the SMALLEST whole-number atom ratio; the molecular formula is the actual atom count in one molecule. Glucose is molecular C₆H₁₂O₆ but empirical CH₂O. Percent data alone can only ever reach the empirical formula.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The four-step reverse trip',
      content:
        '(1) Assume exactly 100 g of sample, so each percent becomes grams. (2) Divide each mass by that element\'s atomic mass to get moles. (3) Divide every mole value by the SMALLEST of them. (4) Multiply through if a fraction survives. The result is the empirical formula.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Percents are not subscripts',
      content:
        '50.0% S with 50.0% O is not SO. Equal MASSES are not equal COUNTS, because a sulfur atom weighs twice an oxygen atom: 50.0 ÷ 32.0 = 1.56 mol S against 50.0 ÷ 16.0 = 3.13 mol O → 1 : 2, so SO₂. Step 2 of the recipe exists precisely for this.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The multiply-through rescue',
      content:
        'After dividing by the smallest, a ratio ending in .5 gets multiplied by 2, one ending in .33 or .67 by 3, one ending in .25 by 4. Only values already within about 0.1 of a whole number (1.98, 3.02) may be rounded — nothing else.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Empirical → molecular with n',
      content:
        'The molecular formula needs one extra fact: the compound\'s molar mass. n = (molar mass) ÷ (empirical formula mass), then multiply EVERY subscript by n, including the invisible 1s. n = 2 turns CH₂O into C₂H₄O₂.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Same percents ≠ same compound',
      content:
        'Every compound sharing an empirical formula shares its percent composition. C₂H₄ and C₃H₆ both reduce to CH₂ and are both 85.7% C. Percent data narrows the field; only a molar mass finishes the job.',
    },
  ],
  methods: [
    {
      title: 'Percent composition from a formula',
      when_to_use:
        'When you are given a formula and asked for the mass percent of one element — or to verify a candidate formula against lab percentages.',
      steps: [
        'Compute the compound\'s molar mass: sum each atomic mass times its subscript.',
        'Compute the mass that ONE element contributes: its atomic mass × its subscript.',
        'Divide the element mass by the molar mass and multiply by 100.',
        'Repeat for each element and confirm the percents add to 100 (allow rounding).',
      ],
      example: {
        problem: 'Percent carbon in methane, CH₄ (C = 12.0, H = 1.0).',
        solution:
          'M = 12.0 + 4(1.0) = 16.0 g/mol. Carbon contributes 12.0. (12.0 ÷ 16.0) × 100 = 75%. Hydrogen is the remaining 25%.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Empirical formula from mass-percent data',
      when_to_use:
        'When lab data gives mass percentages (or masses) of each element and asks for the formula.',
      steps: [
        'Assume 100 g of sample so each percent reads directly as grams (if given grams, skip this).',
        'Divide each mass by that element\'s atomic mass to get moles.',
        'Divide every mole value by the smallest mole value.',
        'If a result ends in .5 multiply all by 2; .33 or .67 by 3; .25 by 4. Round only what is already within about 0.1 of a whole number.',
        'Write the whole numbers as subscripts. To go molecular, compute n = (given molar mass ÷ empirical formula mass) and scale every subscript by n.',
      ],
      example: {
        problem: 'A phosphorus oxide is 43.7% P and 56.3% O (P = 31.0, O = 16.0).',
        solution:
          '100 g → 43.7 g P, 56.3 g O. Moles: 43.7 ÷ 31.0 = 1.41; 56.3 ÷ 16.0 = 3.52. Divide by 1.41: 1.00 and 2.50. The .5 means double: 2 and 5 → P₂O₅. Forward check: 2(31.0) + 5(16.0) = 142.0, and 62.0 ÷ 142.0 = 43.7%. ✓',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Verify an empirical formula by working forward',
      when_to_use:
        'After any empirical-formula answer, especially one that required a multiply-through — it catches a bad round instantly.',
      steps: [
        'Compute the molar mass of the formula you just wrote.',
        'Compute each element\'s percent composition from it.',
        'Compare to the given data; a mismatch of more than a few tenths means a rounding or division error upstream.',
        'If the check fails, revisit step 3 or 4 of the reverse trip — a rounded .5 is the usual culprit.',
      ],
      example: {
        problem: 'Was PO₃ a legitimate answer for 43.7% P, 56.3% O?',
        solution:
          'PO₃ has M = 31.0 + 3(16.0) = 79.0, giving 31.0 ÷ 79.0 = 39.2% P — not 43.7%. The forward check rejects it; P₂O₅ passes.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Percent composition = (mass of the element in one mole ÷ molar mass) × 100, and the percents must total 100. A total that misses badly means a missed subscript.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Never read a percent as a subscript. Equal masses are not equal atom counts — 50.0% S with 50.0% O is SO₂, not SO.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Rounding 2.5 up to 3 is the single most common way this problem is lost. A .5 ending is a signal to double, not noise to round away.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Percent data gives the EMPIRICAL formula only. Without a molar mass you cannot distinguish CH₂O from C₂H₄O₂ from C₆H₁₂O₆ — they share every percentage.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'When scaling empirical → molecular, n multiplies EVERY subscript, including the hidden 1s: n = 2 on CH₂O gives C₂H₄O₂, not C₂H₂O₂.',
      kind: 'edge-case',
      relatedLoIds: [LO],
    },
  ],
};
