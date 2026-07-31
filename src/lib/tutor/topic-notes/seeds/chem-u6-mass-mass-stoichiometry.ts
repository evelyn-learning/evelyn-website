/**
 * Chemistry — Unit 6.4: Stoichiometry, Mole Ratios & Mass-Mass Problems.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u6-mass-mass-stoichiometry.ts
 * (planId evelyn.hs.chem.mass-mass-stoichiometry.v1).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.mass-mass-stoichiometry';

export const BASELINE_CHEM_U6_MASS_MASS_STOICHIOMETRY: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.mass-mass-stoichiometry.v1',
  course: 'Chemistry',
  cedUnit: 6,
  cedTopic: '6.4',
  cedTitle: 'Stoichiometry: Mole Ratios & Mass-Mass Problems',
  planId: 'evelyn.hs.chem.mass-mass-stoichiometry.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.mass-mass-stoichiometry.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'Coefficients count moles',
      content:
        'A balanced equation is a recipe written in MOLES. In 2 H₂ + O₂ → 2 H₂O the 2 : 1 : 2 relates moles, not grams: 2 mol of H₂ is 4 g while 1 mol of O₂ is 32 g. The mole ratio between any two substances is read straight off their coefficients.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The three-step highway',
      content:
        'grams of A → moles of A (÷ molar mass of A) → moles of B (× mole ratio B/A) → grams of B (× molar mass of B). Every mass-mass problem is these three steps in this order, with no legal shortcut.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'The mole ratio is the only bridge',
      content:
        'You may cross from substance A to substance B only in MOLES. Applying coefficients directly to grams is the #1 stoichiometry error: for 2 H₂ + O₂ → 2 H₂O it predicts 2.0 g of O₂ for 4.0 g of H₂, when the answer is 32.0 g — off sixteen-fold.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'Molar mass is the on/off ramp',
      content:
        'Sum each atom\'s atomic mass times its subscript: H₂O = 2(1.0) + 16.0 = 18.0 g/mol. SUBSCRIPTS build molar mass; COEFFICIENTS build mole ratios. The two never swap jobs, and coefficients are never changed by editing subscripts.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Ratio direction',
      content:
        'The substance you WANT goes on top of the conversion factor, the one you HAVE on the bottom: moles CO₂ = moles C₃H₈ × (3 mol CO₂ / 1 mol C₃H₈). An upside-down ratio produces a clean-looking but wrong number, so write it as a labeled fraction every time.',
    },
    {
      loId: LO,
      kind: 'law',
      title: 'Conservation of mass as the check',
      content:
        'Total grams in = total grams out across the whole reaction. 4.0 g of H₂ plus 32.0 g of O₂ must make exactly 36.0 g of H₂O. If the books do not balance, one of the three steps went wrong.',
    },
  ],
  methods: [
    {
      title: 'Mass-mass three-step',
      when_to_use:
        'When a balanced equation is given with a mass of one substance and a mass of another is wanted.',
      steps: [
        'Confirm the equation is BALANCED before reading any coefficient — an unbalanced equation gives a wrong ratio.',
        'On-ramp: grams A × (1 mol A / molar mass A) = moles A.',
        'Bridge: moles A × (coefficient of B / coefficient of A) = moles B, with B written on top.',
        'Off-ramp: moles B × (molar mass B / 1 mol B) = grams B.',
        'Check with conservation of mass, and check that units cancelled to grams of B.',
      ],
      example: {
        problem:
          'Grams of water from 4.0 g of H₂ burning: 2 H₂ + O₂ → 2 H₂O (H₂ = 2.0 g/mol, H₂O = 18.0 g/mol).',
        solution:
          '4.0 g ÷ 2.0 g/mol = 2.0 mol H₂ → 2.0 mol × (2 mol H₂O / 2 mol H₂) = 2.0 mol H₂O → 2.0 mol × 18.0 g/mol = 36.0 g H₂O. Check: 4.0 g H₂ + 32.0 g O₂ in = 36.0 g out. ✓',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Build the mole ratio from a balanced equation',
      when_to_use:
        'Any time you need to cross between two substances — the bridge step of every stoichiometry problem.',
      steps: [
        'Identify the HAVE substance and the WANT substance by name and formula.',
        'Read each one\'s coefficient from the balanced equation (a missing coefficient is 1).',
        'Write the factor as (coefficient of WANT mol WANT / coefficient of HAVE mol HAVE), with substance labels attached.',
        'Confirm the HAVE label cancels against the moles you carried in; if it does not, the factor is inverted.',
      ],
      example: {
        problem: 'Moles of CO₂ from 2.0 mol of propane: C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O.',
        solution:
          'WANT CO₂ (3), HAVE C₃H₈ (1) → factor (3 mol CO₂ / 1 mol C₃H₈). 2.0 mol C₃H₈ × 3 = 6.0 mol CO₂.',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'A balanced equation is a recipe in MOLES. Coefficients give mole ratios, never gram ratios.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'Grams may never cross the bridge directly. Multiplying grams of reactant by the coefficient ratio is the classic wrong answer — convert to moles first, always.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Subscripts build molar mass; coefficients build mole ratios. Never balance an equation by editing subscripts — that changes the substance.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        'Put the WANT substance on top of the mole ratio. An inverted factor still produces a tidy number, so label the units inside the fraction and check the cancellation.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Free sanity check: total grams in must equal total grams out. It costs one line and catches most three-step slips.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
  ],
};
