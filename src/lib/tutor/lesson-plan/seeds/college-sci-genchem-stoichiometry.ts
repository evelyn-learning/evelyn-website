/**
 * College General Chemistry — Stoichiometry & Limiting Reagents.
 */

import type { LessonPlan } from '../types';

export const SEED_COLLEGE_SCI_GENCHEM_STOICHIOMETRY: LessonPlan = {
  id: 'evelyn.college.sci.genchem.stoichiometry.v1',
  title: 'General Chemistry — Stoichiometry and Limiting Reagents',
  curriculum: 'CCSS',
  grade: 'college',
  subject: 'science',
  topic: 'general-chemistry',
  locale: 'en',
  los: [
    {
      id: 'college.sci.genchem.stoichiometry',
      description: 'Apply mole ratios from balanced equations to compute reactant/product masses; identify limiting and excess reagents; calculate theoretical and percent yield.',
      standard: 'COLLEGE-GENCHEM',
    },
  ],
  prerequisites: [],
  followUps: ['college.sci.genchem.equilibrium'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Stoichiometry is the bookkeeping of chemistry — without it, you can\'t predict yields or scale a reaction.',
      script: 'You have 10 g of one reagent and 15 g of another. How much product do you get? Which reagent runs out first? These are the most-tested questions in gen chem, and the answer always starts the same way: balance the equation, convert to moles, use the mole ratio, convert back.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-stoich',
      kind: 'concept',
      goal: 'Mole ratios, mass-mole-mass workflow, limiting reagent, percent yield.',
      keyIdeas: [
        'EVERY stoichiometry problem follows: MASS_A → MOLES_A → (mole ratio from balanced equation) → MOLES_B → MASS_B.',
        'MOLE RATIO is read from the balanced equation\'s coefficients.',
        '  2 H₂ + O₂ → 2 H₂O. Ratio H₂ : O₂ : H₂O is 2 : 1 : 2.',
        'LIMITING REAGENT: the reactant that runs out first; controls how much product can form.',
        'PROCEDURE for limiting reagent:',
        '  1. Convert each reactant\'s mass to moles.',
        '  2. Divide moles by stoichiometric coefficient.',
        '  3. The smallest quotient is the limiting reagent.',
        '  4. Use that reagent\'s mole count + ratio to compute product moles → mass.',
        'EXCESS REAGENT: the others; some leftover after limiting one is consumed. Compute leftover by subtracting consumed moles.',
        'THEORETICAL YIELD: mass of product calculated from limiting reagent (assuming 100% reaction).',
        'ACTUAL YIELD: mass actually obtained in lab.',
        'PERCENT YIELD = (actual / theoretical) × 100%.',
      ],
      vocabulary: [
        { term: 'limiting reagent', definition: 'the reactant consumed first; it determines maximum product amount.' },
        { term: 'percent yield', definition: '(actual / theoretical) × 100; measures reaction efficiency vs ideal.' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked',
      kind: 'worked_example',
      problem: 'For N₂ + 3 H₂ → 2 NH₃, you have 28 g N₂ and 6 g H₂. Find the limiting reagent and theoretical mass of NH₃ produced. (M: N₂=28, H₂=2.02, NH₃=17.03 g/mol.)',
      steps: [
        'Convert to moles. n(N₂) = 28/28 = 1.00 mol. n(H₂) = 6/2.02 ≈ 2.97 mol.',
        'Divide by coefficient. N₂: 1.00/1 = 1.00. H₂: 2.97/3 ≈ 0.990.',
        'Smaller quotient = limiting reagent. H₂ is LIMITING (just barely).',
        'Use H₂ moles to find NH₃: ratio H₂ : NH₃ = 3 : 2. So n(NH₃) = (2/3) × 2.97 = 1.98 mol.',
        'Mass: 1.98 × 17.03 ≈ 33.7 g NH₃.',
      ],
      answer: 'H₂ is limiting; theoretical NH₃ ≈ 33.7 g',
      estimatedMinutes: 5,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'In the same reaction above, if the actual yield was 28.0 g NH₃, what is the percent yield?',
      expectedAnswer: '% yield = (28.0 / 33.7) × 100 ≈ 83.1%.',
      responseFormat: 'numeric',
      hints: ['Use the theoretical yield from the worked example.', '% yield = actual/theoretical × 100.'],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-mass-ratio',
      kind: 'misconception_check',
      question: 'A student takes the mass ratio (28 g N₂ vs 6 g H₂), sees N₂ is heavier, and concludes N₂ is in excess. Why is this reasoning wrong?',
      commonErrors: [
        {
          answer: 'Compares masses directly',
          misconception: 'Skipping the conversion to moles before applying the stoichiometric ratio.',
          correctsTo: 'Mass and mole are not interchangeable. H₂ has molar mass ≈ 2; 6 g of H₂ is 3 mol — many particles. N₂ at 28 g is 1 mol. The reaction needs THREE H₂ per N₂, so per-mol balance matters, not raw mass. Always: mass → moles → divide by coefficient → smallest is limiting.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'mass → moles → mole ratio → moles → mass.',
        'Limiting reagent: smallest (moles / coefficient).',
        '% yield = actual / theoretical × 100.',
        'Never compare masses directly — convert to moles first.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
