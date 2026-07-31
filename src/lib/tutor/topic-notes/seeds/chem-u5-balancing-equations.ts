/**
 * Chemistry — Unit 5 topic 5.1: Chemical Equations & Balancing.
 *
 * Source plan: src/lib/tutor/lesson-plan/seeds/chem-u5-balancing-equations.ts
 * (planId evelyn.hs.chem.balancing-equations.v1).
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.balancing-equations';

export const BASELINE_CHEM_U5_BALANCING_EQUATIONS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.balancing-equations.v1',
  course: 'Chemistry',
  cedUnit: 5,
  cedTopic: '5.1',
  cedTitle: 'Chemical Equations & Balancing',
  planId: 'evelyn.hs.chem.balancing-equations.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.balancing-equations.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'law',
      title: 'Conservation of atoms → conservation of mass',
      content:
        'A reaction only REARRANGES atoms; none are created or destroyed. 10 O atoms on the left means 10 O atoms on the right. Since each atom carries a fixed mass, conserved atoms force conserved MASS — the sealed-flask result Lavoisier established in 1789.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Anatomy of an equation',
      content:
        'Reactants left, products right, → read as "produces". State labels ride in parentheses: (s) solid, (l) liquid, (g) gas, (aq) dissolved in water. Model: CH₄(g) + 2 O₂(g) → CO₂(g) + 2 H₂O(g).',
    },
    {
      loId: LO,
      kind: 'definition',
      title: 'Coefficient vs subscript',
      content:
        'COEFFICIENT = the big number in FRONT of a formula; it multiplies every atom in that formula (3 H₂O = 6 H + 3 O). It answers "how many" and is the only number you may change. SUBSCRIPT = the small number INSIDE a formula; it fixes what the substance IS. H₂O → H₂O₂ is not a balance, it is a swap of water for hydrogen peroxide.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The balancing order',
      content:
        'Write correct formulas and freeze them → tally each element on both sides → balance one element at a time, saving H and O for last → RE-TALLY after every coefficient change, because one change ripples → confirm all elements match AND the coefficient set shares no common factor.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Polyatomic shortcut',
      content:
        'An ion that passes through the reaction unchanged (SO₄²⁻, NO₃⁻, PO₄³⁻) can be tallied as one block instead of atom by atom. In Ca(OH)₂ + 2 HNO₃ → Ca(NO₃)₂ + 2 H₂O, count NO₃ as a single unit.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Fractional coefficients are legal intermediates',
      content:
        'Hydrocarbon combustion with an odd oxygen tally lands on a half-coefficient such as 7/2 O₂. That is a signal, not an error: multiply EVERY coefficient in the equation by 2 to clear it. Never clear a fraction by editing a subscript.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: '"Balanced" is not the finish line',
      content:
        '8 Fe + 6 O₂ → 4 Fe₂O₃ tallies perfectly yet is still wrong, because the coefficients share the factor 2. The answer is the SMALLEST whole-number set: 4 Fe + 3 O₂ → 2 Fe₂O₃.',
    },
  ],
  methods: [
    {
      title: 'Balance a hydrocarbon combustion (C → H → O order)',
      when_to_use:
        'Any CₓH_y + O₂ → CO₂ + H₂O problem, and more generally whenever one element appears in several products.',
      steps: [
        'Confirm every formula is correct, then freeze all subscripts.',
        'CARBON first: all carbons in the fuel land in CO₂, one each, so the CO₂ coefficient equals the carbon subscript.',
        'HYDROGEN second: each H₂O carries 2 H, so the H₂O coefficient is (H in fuel) ÷ 2.',
        'OXYGEN last, because it is now pinned on both product sides: total right-side O = 2 × (CO₂ coefficient) + 1 × (H₂O coefficient); divide by 2 for the O₂ coefficient.',
        'If that division gives a fraction, multiply every coefficient in the equation by 2.',
        'RE-TALLY every element, then check that the coefficient set has no common factor.',
      ],
      example: {
        problem: 'Balance C₃H₈ + O₂ → CO₂ + H₂O.',
        solution:
          'C: 3 → 3 CO₂. H: 8 ÷ 2 = 4 → 4 H₂O. O on the right: 3 × 2 + 4 × 1 = 10, so 10 ÷ 2 = 5 O₂. Result C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O; tally C 3 = 3, H 8 = 8, O 10 = 10; the set 1, 5, 3, 4 is already lowest terms.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Clear a fractional coefficient',
      when_to_use:
        'When the last element (usually O) needs an odd atom count divided by 2, producing something like 7/2 O₂.',
      steps: [
        'Keep the fraction in place — do not touch any subscript to avoid it.',
        'Identify the denominator (almost always 2 in HS work).',
        'Multiply EVERY coefficient in the whole equation by that denominator, including the implied 1 in front of the fuel.',
        'Re-tally all elements on the scaled equation.',
        'Confirm lowest terms: an odd coefficient anywhere (e.g. 7) guarantees no common factor of 2 remains.',
      ],
      example: {
        problem: 'C₂H₆ + O₂ → CO₂ + H₂O gets stuck at 7/2 O₂. Finish it.',
        solution:
          'C₂H₆ + 7/2 O₂ → 2 CO₂ + 3 H₂O. Multiply everything by 2: 2 C₂H₆ + 7 O₂ → 4 CO₂ + 6 H₂O. Tally C 4 = 4, H 12 = 12, O 14 = 8 + 6 = 14. The 7 is odd, so 2, 7, 4, 6 is lowest terms.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Audit a candidate balanced equation',
      when_to_use:
        'Multiple-choice items that offer several tallying-correct equations, or any final check before submitting an answer.',
      steps: [
        'Verify each formula is a real substance — reject anything with an invented subscript such as O₇ or a lone O written in place of O₂.',
        'Tally every element on both sides, one element at a time.',
        'If the tallies match, take the greatest common factor of all coefficients.',
        'If that factor is greater than 1, divide every coefficient by it; the reduced version is the intended answer.',
      ],
      example: {
        problem: 'Which is balanced with the smallest whole-number coefficients: 4 Fe + 3 O₂ → 2 Fe₂O₃ or 8 Fe + 6 O₂ → 4 Fe₂O₃?',
        solution:
          'Both tally (Fe 8 = 8, O 12 = 12 in the second). But 8, 6, 4 share the factor 2, so it reduces to 4 Fe + 3 O₂ → 2 Fe₂O₃ — the correct answer.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'Atoms are conserved, so mass is conserved. In a sealed flask, 4.0 g H₂ + 32.0 g O₂ must give 36.0 g H₂O — nothing can leave.',
      kind: 'tip',
    },
    {
      content:
        'Coefficients (in front) are adjustable; subscripts (inside) are locked identity. Changing a subscript swaps the substance instead of fixing the count.',
      kind: 'tip',
    },
    {
      content:
        'Common error: "balancing" H₂ + O₂ → H₂O by writing H₂O₂. The atoms tally, but the product is now hydrogen peroxide, a bleach. The real answer is 2 H₂ + O₂ → 2 H₂O.',
      kind: 'common-error',
    },
    {
      content:
        'Gotcha: equal atom counts are necessary but not sufficient. Always divide out a common factor at the end — 8 Fe + 6 O₂ → 4 Fe₂O₃ is a trap answer.',
      kind: 'gotcha',
    },
    {
      content:
        'Save H and O for last. They usually appear in more than one species, so pinning them early forces you to redo everything.',
      kind: 'tip',
    },
    {
      content:
        'Edge case: an odd oxygen tally is normal in combustion. 7/2 O₂ is a legal intermediate — double every coefficient rather than splitting O₂ into single O atoms.',
      kind: 'edge-case',
    },
  ],
};
