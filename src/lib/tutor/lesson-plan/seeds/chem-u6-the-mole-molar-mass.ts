/**
 * Chemistry — The Mole & Stoichiometry: The Mole and Molar Mass.
 *
 * The counting unit that makes chemistry weighable (NGSS HS-PS1-7): the
 * mole as a fixed particle count, and molar mass built atom-by-atom from
 * a formula. The star misconception gets equal billing — "heavier sample
 * = more particles" — along with the subscript-distribution slip that
 * wrecks molar masses of compounds written with parentheses.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U6_THE_MOLE_MOLAR_MASS: LessonPlan = {
  id: 'evelyn.hs.chem.the-mole-molar-mass.v1',
  title: 'The Mole & Molar Mass',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.the-mole-molar-mass',
      standard: 'CHEM-6.1',
      description:
        'Explain the mole as a fixed count of particles and calculate the molar mass of an element or compound from its chemical formula (NGSS HS-PS1-7).',
    },
  ],
  prerequisites: ['chem.redox-intro'],
  followUps: ['chem.mole-conversions'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'The mole as chemistry\'s counting unit — the only way a balance can tell you how many atoms you just poured.',
      script:
        'A pharmacist filling a prescription cannot count out molecules of a painkiller one at a time — a single 500 mg tablet holds roughly 1,700,000,000,000,000,000,000 of them. Reactions happen particle-by-particle, but every instrument in a lab measures grams. Chemists bridged that gap with a counting unit: the MOLE. Just as "a dozen" means 12 no matter what you are counting, a mole means 6.02 × 10²³ particles — and it is defined so that one mole of a substance weighs, in grams, exactly the number you can read off the periodic table. Learn to build that number from a formula and the entire rest of this course opens up.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mole-molar-mass',
      kind: 'concept',
      goal: 'The mole as a fixed particle count, molar mass assembled atom-by-atom from the formula, and the two classic traps.',
      keyIdeas: [
        'A MOLE IS A COUNT, NOT A MASS — one mole = 6.02 × 10²³ particles (Avogadro\'s number), exactly the way one dozen = 12. One mole of helium atoms and one mole of lead atoms contain the SAME number of atoms; they simply weigh wildly different amounts.',
        'WHY THAT PARTICULAR NUMBER — it is chosen so the atomic mass on the periodic table does double duty: carbon is 12.0 atomic mass units per atom AND 12.0 grams per mole. That coincidence is the whole point — it converts an invisible count into a weighable quantity.',
        'MOLAR MASS = SUM OF THE ATOMS — read the formula, multiply each element\'s atomic mass by its subscript, add. H₂O = 2(1.0) + 16.0 = 18.0 g/mol. CO₂ = 12.0 + 2(16.0) = 44.0 g/mol. Units are always grams per mole.',
        'SUBSCRIPTS DISTRIBUTE THROUGH PARENTHESES — in Mg(OH)₂ the outside 2 multiplies EVERYTHING inside: 24.0 + 2(16.0) + 2(1.0) = 58.0 g/mol. Applying it to only the last element inside the parentheses is the most common molar-mass error there is.',
        'ELEMENTS THAT TRAVEL IN PAIRS — the diatomic gases H₂, N₂, O₂, F₂, Cl₂, Br₂, I₂ have molar masses TWICE their atomic mass. One mole of oxygen GAS is 32.0 g/mol, not 16.0 — "oxygen" on the table means atoms, O₂ in an equation means molecules.',
        'MOLAR MASS IS THE ON-RAMP AND THE OFF-RAMP — grams ÷ molar mass gives moles; moles × molar mass gives grams. Every quantitative problem in chemistry passes through this one conversion, which is why a wrong molar mass silently poisons every later step.',
        'THE TRAP: HEAVIER ≠ MORE PARTICLES — 56 g of iron and 4 g of helium both contain one mole, so both hold the same 6.02 × 10²³ atoms. Mass tells you the identity-weighted total; only the MOLE tells you how many.',
      ],
      vocabulary: [
        { term: 'mole', definition: 'a fixed count of 6.02 × 10²³ particles — chemistry\'s equivalent of "a dozen".' },
        { term: 'Avogadro\'s number', definition: 'the number of particles in one mole, 6.02 × 10²³ per mole.' },
        { term: 'molar mass', definition: 'the mass in grams of one mole of a substance, found by summing each atom\'s atomic mass times its subscript.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-glucose-molar-mass',
      kind: 'worked_example',
      problem:
        'Glucose has the formula C₆H₁₂O₆. Find its molar mass, then determine how many moles are in a 90.0 g sample. Atomic masses: C = 12.0, H = 1.0, O = 16.0.',
      steps: [
        'Inventory the atoms straight from the formula: 6 carbon, 12 hydrogen, 6 oxygen. The subscripts ARE the counts — nothing else in the formula matters here.',
        'Carbon contributes 6 × 12.0 = 72.0 g/mol; hydrogen contributes 12 × 1.0 = 12.0 g/mol; oxygen contributes 6 × 16.0 = 96.0 g/mol.',
        'Add the three contributions: 72.0 + 12.0 + 96.0 = 180.0 g/mol. One mole of glucose weighs 180.0 g and contains 6.02 × 10²³ glucose molecules.',
        'Now use molar mass as the on-ramp: 90.0 g ÷ 180.0 g/mol = 0.500 mol. A quick sanity check — 90.0 g is half of 180.0 g, so half a mole. ✓',
      ],
      answer: '180.0 g/mol; the 90.0 g sample is 0.500 mol of glucose',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-parentheses-trap',
      kind: 'worked_example',
      problem:
        'A student computes the molar mass of aluminum sulfate, Al₂(SO₄)₃, as 2(27.0) + 32.0 + 4(16.0) = 150.0 g/mol. The true value is 342.0 g/mol. Diagnose the error and rebuild the calculation. Atomic masses: Al = 27.0, S = 32.0, O = 16.0.',
      steps: [
        'Name the move: the student handled Al₂ correctly but then read (SO₄)₃ as if it were a single SO₄ — the outside subscript 3 was dropped entirely.',
        'Why it fails: the 3 sits OUTSIDE the parentheses, so it multiplies every atom inside. The formula unit contains 3 sulfurs and 3 × 4 = 12 oxygens, not 1 sulfur and 4 oxygens.',
        'Rebuild the atom inventory: 2 Al, 3 S, 12 O. Then Al gives 2 × 27.0 = 54.0; S gives 3 × 32.0 = 96.0; O gives 12 × 16.0 = 192.0.',
        'Add: 54.0 + 96.0 + 192.0 = 342.0 g/mol — more than double the student\'s figure. Rule of thumb: rewrite any parenthesized formula as a flat atom list BEFORE multiplying by atomic masses.',
      ],
      answer: '342.0 g/mol — the subscript outside the parentheses multiplies every atom inside',
      estimatedMinutes: 3,
    },
    {
      id: 'try-equal-molecules',
      kind: 'try_yourself',
      problem:
        'You have 1.00 mol of H₂O, 1.00 mol of CO₂, and 1.00 mol of O₂ in three separate flasks. Which flask contains the greatest number of molecules?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'All three contain the same number of molecules', correct: true },
        { id: 'b', text: 'The CO₂ flask, because CO₂ has the largest molar mass' },
        { id: 'c', text: 'The H₂O flask, because water molecules are the smallest and lightest' },
        { id: 'd', text: 'The O₂ flask, because oxygen atoms are heavier than hydrogen atoms' },
      ],
      expectedAnswer: 'All three contain the same number of molecules',
      hints: [
        'A mole is a COUNT, not a mass — the same way a dozen eggs and a dozen bricks are both twelve.',
        'Each flask holds 1.00 mol, so each holds 6.02 × 10²³ molecules. The masses differ; the counts do not.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ethanol-molar-mass',
      kind: 'try_yourself',
      problem:
        'What is the molar mass of ethanol, C₂H₆O? Atomic masses: C = 12.0, H = 1.0, O = 16.0.',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '46.0 g/mol', correct: true },
        { id: 'b', text: '29.0 g/mol' },
        { id: 'c', text: '34.0 g/mol' },
        { id: 'd', text: '62.0 g/mol' },
      ],
      expectedAnswer: '46.0 g/mol',
      hints: [
        'Multiply each atomic mass by its subscript first, then add: carbon appears twice, hydrogen six times, oxygen once.',
        '2(12.0) = 24.0, 6(1.0) = 6.0, and 1(16.0) = 16.0. Add the three contributions.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Calcium nitrate, Ca(NO₃)₂, is a common fertilizer. What is its molar mass in grams per mole? Atomic masses: Ca = 40.0, N = 14.0, O = 16.0. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '164',
      hints: [
        'The 2 outside the parentheses multiplies both the N and the O₃ inside — write the flat atom list first: 1 Ca, 2 N, 6 O.',
        '40.0 + 2(14.0) + 6(16.0) = 40.0 + 28.0 + 96.0 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-heavier-more-atoms',
      kind: 'misconception_check',
      question:
        'A student says: "A 56 g sample of iron must contain more atoms than a 4 g sample of helium — it weighs fourteen times as much." What is wrong with this reasoning?',
      commonErrors: [
        {
          answer: 'The heavier sample has more atoms',
          misconception: 'Reading mass as a particle count, when mass depends on how heavy each individual particle is.',
          correctsTo:
            'Iron atoms are individually about fourteen times heavier than helium atoms, so 56 g of Fe and 4 g of He are each exactly one mole — the SAME 6.02 × 10²³ atoms. Only after dividing by molar mass does a mass tell you a count: 56.0 ÷ 56.0 = 1 mol and 4.0 ÷ 4.0 = 1 mol.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A mole is a count — 6.02 × 10²³ particles — not a mass; equal moles always mean equal numbers of particles.',
        'Molar mass = sum over the formula of (atomic mass × subscript), in g/mol: H₂O = 18.0, CO₂ = 44.0, C₆H₁₂O₆ = 180.0.',
        'A subscript outside parentheses multiplies every atom inside: Al₂(SO₄)₃ has 2 Al, 3 S, and 12 O → 342.0 g/mol.',
        'Diatomic elements travel in pairs: one mole of O₂ gas is 32.0 g, not 16.0.',
        'Molar mass is the on-ramp and the off-ramp: grams ÷ molar mass = moles, moles × molar mass = grams.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.1', cedTitle: 'The Mole & Molar Mass' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
