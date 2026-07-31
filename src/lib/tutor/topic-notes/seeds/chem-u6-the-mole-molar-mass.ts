/**
 * Chemistry — Unit 6.1: The Mole & Molar Mass.
 *
 * Baseline topic notes distilled from the lesson plan
 * src/lib/tutor/lesson-plan/seeds/chem-u6-the-mole-molar-mass.ts
 * (planId evelyn.hs.chem.the-mole-molar-mass.v1).
 *
 * Bump baselineVersion when you make material changes.
 */

import type { TopicNotesBaseline } from '../types';

const LO = 'chem.the-mole-molar-mass';

export const BASELINE_CHEM_U6_THE_MOLE_MOLAR_MASS: TopicNotesBaseline = {
  baselineId: 'evelyn.hs.chem.the-mole-molar-mass.v1',
  course: 'Chemistry',
  cedUnit: 6,
  cedTopic: '6.1',
  cedTitle: 'The Mole & Molar Mass',
  planId: 'evelyn.hs.chem.the-mole-molar-mass.v1',
  baselineVersion: 1,
  lastUpdatedAt: '2026-07-31',
  sources: [{ type: 'plan', planId: 'evelyn.hs.chem.the-mole-molar-mass.v1' }],
  theory: [
    {
      loId: LO,
      kind: 'definition',
      title: 'The mole is a count',
      content:
        'One mole = 6.02 × 10²³ particles (Avogadro\'s number), exactly as one dozen = 12. Identity is irrelevant to the count: a mole of He atoms and a mole of Pb atoms hold the same number of atoms and differ only in mass. "Particles" means whatever the formula names — atoms for Fe, molecules for CO₂, formula units for NaCl.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Why 6.02 × 10²³',
      content:
        'The number is chosen so the periodic-table mass does double duty: carbon is 12.0 amu per atom AND 12.0 g per mole. That is what converts an uncountable particle count into a weighable mass — a balance becomes a particle counter.',
    },
    {
      loId: LO,
      kind: 'formula',
      title: 'Molar mass = Σ(atomic mass × subscript)',
      content:
        'Read the formula, multiply each element\'s atomic mass by its subscript, add. Units always g/mol. H₂O = 2(1.0) + 16.0 = 18.0. CO₂ = 12.0 + 2(16.0) = 44.0. C₆H₁₂O₆ = 72.0 + 12.0 + 96.0 = 180.0.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Subscripts distribute through parentheses',
      content:
        'A subscript outside parentheses multiplies EVERY atom inside. Mg(OH)₂ = 24.0 + 2(16.0) + 2(1.0) = 58.0 g/mol. Al₂(SO₄)₃ contains 2 Al, 3 S, and 3 × 4 = 12 O → 342.0 g/mol. Flatten the formula to an atom list before touching atomic masses.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Diatomic elements',
      content:
        'H₂, N₂, O₂, F₂, Cl₂, Br₂, I₂ travel in pairs, so their molar masses are twice the tabulated atomic mass. One mole of oxygen GAS is 32.0 g/mol, not 16.0 — "O" on the table means atoms, "O₂" in an equation means molecules.',
    },
    {
      loId: LO,
      kind: 'identity',
      title: 'On-ramp and off-ramp',
      content:
        'grams ÷ molar mass = moles; moles × molar mass = grams. Every quantitative problem in the course passes through this one conversion, which is why a wrong molar mass silently poisons every later step.',
    },
    {
      loId: LO,
      kind: 'framework',
      title: 'Mass is not a particle count',
      content:
        '56 g of Fe and 4 g of He are each one mole and therefore hold the same 6.02 × 10²³ atoms. Mass is the identity-weighted total; only the mole reports how many. Dividing by molar mass is what turns a mass into a count.',
    },
  ],
  methods: [
    {
      title: 'Compute molar mass from a chemical formula',
      when_to_use:
        'Any time you need g/mol — before converting grams to moles, before percent composition, before any stoichiometry step.',
      steps: [
        'Rewrite the formula as a FLAT atom list, distributing every subscript that sits outside parentheses (Al₂(SO₄)₃ → 2 Al, 3 S, 12 O).',
        'Look up each element\'s atomic mass and multiply it by that element\'s count.',
        'Add the contributions. Label the result g/mol.',
        'Sanity-check the magnitude: a formula with a dozen heavy atoms should not land near 20 g/mol, and diatomic elements must come out doubled.',
      ],
      example: {
        problem: 'Molar mass of glucose, C₆H₁₂O₆ (C = 12.0, H = 1.0, O = 16.0).',
        solution:
          '6 C, 12 H, 6 O → 6(12.0) = 72.0; 12(1.0) = 12.0; 6(16.0) = 96.0. Sum = 180.0 g/mol.',
      },
      relatedLoIds: [LO],
    },
    {
      title: 'Convert between grams and moles with molar mass',
      when_to_use:
        'When a problem gives a mass and asks for an amount (or gives moles and asks for a mass).',
      steps: [
        'Build the molar mass of the substance named — check whether the substance is an element\'s atoms or a diatomic molecule.',
        'Going grams → moles: divide the mass by the molar mass, written as (1 mol / M g) so grams cancel.',
        'Going moles → grams: multiply by the molar mass, written as (M g / 1 mol) so moles cancel.',
        'Verify by unit cancellation, then by scale: a sample weighing about one molar mass must be about one mole.',
      ],
      example: {
        problem: 'How many moles are in 90.0 g of glucose (M = 180.0 g/mol)?',
        solution: '90.0 g × (1 mol / 180.0 g) = 0.500 mol. Half a molar mass → half a mole. ✓',
      },
      relatedLoIds: [LO],
    },
  ],
  pointers: [
    {
      content:
        'A mole is a COUNT, never a mass. Equal moles of different substances always contain equal numbers of particles and almost never equal masses.',
      kind: 'tip',
      relatedLoIds: [LO],
    },
    {
      content:
        'The #1 molar-mass error: applying a subscript outside parentheses to only the last element inside. Al₂(SO₄)₃ is 342.0 g/mol; reading it as 2 Al + 1 S + 4 O gives 150.0 — off by more than double.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'Watch for the diatomic seven (H₂, N₂, O₂, F₂, Cl₂, Br₂, I₂). If a problem says oxygen GAS, use 32.0 g/mol; the tabulated 16.0 is per atom.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
    {
      content:
        '"Heavier sample = more atoms" is false. 56 g Fe and 4 g He are both 1 mol because an Fe atom is about fourteen times heavier than a He atom.',
      kind: 'common-error',
      relatedLoIds: [LO],
    },
    {
      content:
        'A wrong molar mass never announces itself — it just produces a plausible wrong answer three steps later. Recompute it once before moving on.',
      kind: 'gotcha',
      relatedLoIds: [LO],
    },
  ],
};
