/**
 * HS Chemistry — Mole Concept and Stoichiometry.
 * NGSS HS-PS1-7: provide evidence atoms are conserved.
 */

import type { LessonPlan } from '../types';

export const SEED_CHEM_MOLE_STOICHIOMETRY: LessonPlan = {
  id: 'evelyn.hs.science.chemistry.mole-stoichiometry.v1',
  title: 'The Mole and Stoichiometry',
  curriculum: 'NGSS', grade: '9-12', subject: 'science', topic: 'chemistry', locale: 'en',
  los: [{ id: 'ngss.hs-ps1-7', description: 'Use mathematical representations to support the claim that atoms, and therefore mass, are conserved during a chemical reaction.', standard: 'NGSS.HS-PS1-7' }],
  prerequisites: ['hs.chem.naming-compounds'], followUps: ['hs.chem.balancing-equations'], estimatedMinutes: 24,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Anchor in scale.', script: 'A teaspoon of water has about 5,000,000,000,000,000,000,000,000 molecules. Chemists need a way to count atoms in big batches. They invented the MOLE — like a "dozen," but for atoms. One mole = 6.022 × 10²³ things. The number is huge because atoms are tiny.', estimatedMinutes: 2 },
    { id: 'concept-mole', kind: 'concept', goal: 'A mole is 6.022×10²³ particles. Molar mass converts moles to grams.', keyIdeas: [
      'MOLE = 6.022 × 10²³ particles (Avogadro\'s number, Nₐ).',
      'It\'s the bridge between ATOMIC SCALE and LAB SCALE.',
      'MOLAR MASS: mass of 1 mole of a substance, in grams. Equals the atomic mass in g/mol.',
      '  · C: 12.01 g/mol (1 mole of C atoms = 12.01 g).',
      '  · H₂O: 2(1.01) + 16.00 = 18.02 g/mol.',
      'CONVERSIONS:',
      '  · grams → moles: divide by molar mass.',
      '  · moles → grams: multiply by molar mass.',
      '  · moles → particles: multiply by Nₐ.',
      'MOLE RATIO from a balanced equation tells you ratios in any chemical reaction.',
    ], vocabulary: [{ term: 'mole', definition: '6.022×10²³ particles.' }, { term: 'molar mass', definition: 'mass of 1 mole, in g/mol.' }, { term: 'Avogadro\'s number', definition: '6.022×10²³.' }], suggestedTools: ['show_equation'], estimatedMinutes: 5 },
    { id: 'concept-stoich', kind: 'concept', goal: 'Stoichiometry = using mole ratios to predict amounts in reactions.', keyIdeas: [
      'STOICHIOMETRY = the math of reactions.',
      'Coefficients in a balanced equation = MOLE RATIOS.',
      'EXAMPLE: 2 H₂ + O₂ → 2 H₂O.',
      '  · Mole ratio: 2 mol H₂ : 1 mol O₂ : 2 mol H₂O.',
      'STEPS for any stoichiometry problem:',
      '  1. Write a BALANCED equation.',
      '  2. Convert known to MOLES (grams ÷ molar mass).',
      '  3. Use mole ratio to find moles of target.',
      '  4. Convert target to desired unit (× molar mass for grams).',
      'LIMITING REACTANT: the one that runs out first → controls product amount.',
    ], estimatedMinutes: 5 },
    { id: 'worked-stoich', kind: 'worked_example', problem: 'How many grams of water form when 4.0 g of hydrogen burns completely with oxygen? 2 H₂ + O₂ → 2 H₂O.', steps: [
      'STEP 1: Equation is balanced. Mole ratio H₂ : H₂O = 2 : 2 = 1 : 1.',
      'STEP 2: Convert g of H₂ to moles. Molar mass H₂ = 2.02 g/mol.',
      '  · 4.0 g ÷ 2.02 g/mol ≈ 1.98 mol H₂.',
      'STEP 3: Mole ratio: 1.98 mol H₂ × (2 mol H₂O / 2 mol H₂) = 1.98 mol H₂O.',
      'STEP 4: Convert mol H₂O to grams. Molar mass H₂O = 18.02 g/mol.',
      '  · 1.98 mol × 18.02 g/mol ≈ 35.7 g.',
    ], answer: '~35.7 g of water. Stoichiometry: g → mol → mol → g.', estimatedMinutes: 5 },
    { id: 'try-1', kind: 'try_yourself', problem: 'How many moles of CO₂ form from 5.0 mol of glucose (C₆H₁₂O₆)? Equation: C₆H₁₂O₆ + 6 O₂ → 6 CO₂ + 6 H₂O.', expectedAnswer: 'Mole ratio glucose : CO₂ = 1 : 6. So 5.0 mol glucose × 6 = 30 mol CO₂. (This is what your body produces metabolically — that\'s why you exhale CO₂ after a meal.)', responseFormat: 'numeric', hints: ['Use the coefficients in the equation.', 'Mole ratio is straight multiplication.'], estimatedMinutes: 3 },
    { id: 'misconception-coefficients-grams', kind: 'misconception_check', question: 'A friend says "the equation 2 H₂ + O₂ → 2 H₂O means 2 grams H₂ + 1 gram O₂ → 2 grams H₂O." Right?', commonErrors: [{ answer: 'Yes — 2:1:2 grams.', misconception: 'Treating coefficients as mass.', correctsTo: 'Coefficients are MOLE ratios, NOT gram ratios. 2 mol H₂ (4 g) + 1 mol O₂ (32 g) → 2 mol H₂O (36 g). Mass IS conserved (4+32 = 36) but the gram ratio isn\'t 2:1:2. Always convert grams ↔ moles using molar mass first.' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['1 mole = 6.022×10²³ particles.', 'Molar mass = atomic mass in g/mol.', 'Stoichiometry: g → mol → mol → g (using balanced equation ratios).', 'Coefficients give MOLE ratios, never gram ratios.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' }, schemaVersion: 1,
};
