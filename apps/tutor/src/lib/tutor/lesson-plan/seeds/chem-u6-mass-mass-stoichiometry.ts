/**
 * Chemistry — The Mole & Stoichiometry: Mass-Mass Problems.
 *
 * The mole ratio as the only legal bridge between substances
 * (NGSS HS-PS1-7): grams → moles → moles → grams, with the classic
 * gram-ratio shortcut error given a full worked example. Numbers are
 * chosen so every answer lands on a clean integer or one-decimal value.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U6_MASS_MASS_STOICHIOMETRY: LessonPlan = {
  id: 'evelyn.hs.chem.mass-mass-stoichiometry.v1',
  title: 'Stoichiometry: Mole Ratios & Mass-Mass Problems',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.mass-mass-stoichiometry',
      standard: 'CHEM-6.4',
      description:
        'Use mole ratios from balanced equations to convert between masses of reactants and products via the grams-to-moles-to-moles-to-grams pathway (NGSS HS-PS1-7).',
    },
  ],
  prerequisites: ['chem.percent-composition-empirical'],
  followUps: ['chem.limiting-reactant-yield'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Stoichiometry as the recipe math behind real engineering — airbags must inflate exactly, not approximately.',
      script:
        'A car airbag inflates from the reaction 2 NaN₃ → 2 Na + 3 N₂ in about 30 milliseconds. Pack too little sodium azide and the bag sags; too much and it bursts. The engineer\'s question — "how many grams give exactly the right amount of nitrogen gas?" — is pure stoichiometry: the recipe math of chemistry. A balanced equation is a recipe written in MOLES, and today you learn to scale that recipe into grams, the units a real scale can measure.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-mole-bridge',
      kind: 'concept',
      goal: 'The three-step pathway and why the mole ratio — never the gram ratio — is the only legal bridge.',
      keyIdeas: [
        'COEFFICIENTS COUNT MOLES — in 2 H₂ + O₂ → 2 H₂O, the 2 : 1 : 2 ratio relates MOLES of each substance. It says nothing directly about grams: 2 mol of H₂ is only 4 g while 1 mol of O₂ is 32 g.',
        'THE THREE-STEP HIGHWAY — grams of A → moles of A (divide by molar mass of A) → moles of B (multiply by the mole ratio B/A) → grams of B (multiply by molar mass of B). Every mass-mass problem is these three steps in this order.',
        'THE MOLE RATIO IS THE ONLY BRIDGE — you may only cross from substance A to substance B in MOLES. Converting grams of A straight to grams of B with coefficients is the #1 stoichiometry error.',
        'MOLAR MASS IS THE ON/OFF RAMP — from the formula, sum each atom\'s atomic mass times its subscript: H₂O = 2(1.0) + 16.0 = 18.0 g/mol. Subscripts build molar mass; coefficients build mole ratios — never swap their jobs.',
        'PICK THE RATIO DIRECTION — the substance you WANT goes on top: moles of H₂O = moles of H₂ × (2 mol H₂O / 2 mol H₂). Writing the ratio upside-down silently wrecks the answer.',
        'SANITY CHECK WITH CONSERVATION — mass is conserved across the whole reaction (HS-PS1-7): total grams in = total grams out. If 4 g of hydrogen plus 32 g of oxygen make anything other than 36 g of water, a step went wrong.',
      ],
      vocabulary: [
        { term: 'mole ratio', definition: 'the ratio of coefficients between two substances in a balanced equation, used to convert moles of one into moles of the other.' },
        { term: 'molar mass', definition: 'the mass in grams of one mole of a substance, computed from the formula\'s atomic masses.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-mass-mass',
      kind: 'worked_example',
      problem:
        'How many grams of water form when 4.0 g of hydrogen gas burns completely? Equation: 2 H₂ + O₂ → 2 H₂O. Molar masses: H₂ = 2.0 g/mol, H₂O = 18.0 g/mol.',
      steps: [
        'Step 1 — grams to moles (on-ramp): 4.0 g H₂ ÷ 2.0 g/mol = 2.0 mol H₂.',
        'Step 2 — cross the mole bridge: the ratio is 2 mol H₂O per 2 mol H₂, so 2.0 mol H₂ × (2/2) = 2.0 mol H₂O.',
        'Step 3 — moles to grams (off-ramp): 2.0 mol H₂O × 18.0 g/mol = 36.0 g H₂O.',
        'Sanity check: 4.0 g of H₂ consumed 2.0 mol H₂ × (1 O₂/2 H₂) = 1.0 mol O₂ = 32.0 g. Mass in = 4.0 + 32.0 = 36.0 g = mass out. ✓',
      ],
      answer: '36.0 g of H₂O',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-gram-ratio-trap',
      kind: 'worked_example',
      problem:
        'For the same reaction (2 H₂ + O₂ → 2 H₂O), a student answers: "The ratio of H₂ to O₂ is 2 : 1, so 4.0 g of H₂ needs 2.0 g of O₂." The true answer is 32.0 g. Diagnose the error.',
      steps: [
        'Name the move: the student applied the coefficient ratio 2 : 1 directly to GRAMS — treating a mole recipe as a gram recipe.',
        'Why it fails: coefficients count particles (moles), and particles of H₂ and O₂ have wildly different masses — one mole of O₂ (32.0 g) outweighs one mole of H₂ (2.0 g) sixteen-fold.',
        'The legal route: 4.0 g H₂ ÷ 2.0 g/mol = 2.0 mol H₂ → cross the bridge: 2.0 mol H₂ × (1 mol O₂ / 2 mol H₂) = 1.0 mol O₂.',
        'Off-ramp: 1.0 mol O₂ × 32.0 g/mol = 32.0 g O₂ — sixteen times the student\'s answer. Grams may never cross the bridge directly.',
      ],
      answer: '32.0 g of O₂ — coefficients relate moles, never grams',
      estimatedMinutes: 3,
    },
    {
      id: 'try-ratio-setup',
      kind: 'try_yourself',
      problem:
        'Propane burns: C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O. You know the moles of C₃H₈ and want moles of CO₂. Which conversion factor is correct?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '3 mol CO₂ / 1 mol C₃H₈', correct: true },
        { id: 'b', text: '1 mol C₃H₈ / 3 mol CO₂' },
        { id: 'c', text: '44 g CO₂ / 44 g C₃H₈' },
        { id: 'd', text: '5 mol O₂ / 3 mol CO₂' },
      ],
      expectedAnswer: '3 mol CO₂ / 1 mol C₃H₈',
      hints: [
        'The substance you WANT (CO₂) goes on top; the substance you HAVE (C₃H₈) goes on the bottom.',
        'Read both coefficients straight from the balanced equation: 3 CO₂ per 1 C₃H₈.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-coefficients-vs-grams',
      kind: 'try_yourself',
      problem: 'Which statement about a balanced chemical equation is TRUE?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The coefficients give the ratio of moles of each substance', correct: true },
        { id: 'b', text: 'The coefficients give the ratio of grams of each substance' },
        { id: 'c', text: 'The subscripts can be changed to balance the equation' },
        { id: 'd', text: 'Equal coefficients mean equal masses react' },
      ],
      expectedAnswer: 'The coefficients give the ratio of moles of each substance',
      hints: [
        'Two of the choices confuse moles with grams; one confuses coefficients with subscripts.',
        'Coefficients count particles by the mole; different substances have different molar masses, so equal moles are never automatically equal grams.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'Using C₃H₈ + 5 O₂ → 3 CO₂ + 4 H₂O: how many moles of CO₂ are produced when 2.0 mol of propane burns completely? Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '6',
      hints: [
        'Cross the mole bridge: multiply moles of propane by (3 mol CO₂ / 1 mol C₃H₈).',
        '2.0 × 3 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-gram-ratio',
      kind: 'misconception_check',
      question:
        'A student computes grams of product by multiplying grams of reactant by the coefficient ratio, skipping moles entirely. Why does this fail?',
      commonErrors: [
        {
          answer: 'Grams × coefficient ratio = grams of product',
          misconception: 'Treating coefficients as a mass ratio instead of a mole (particle-count) ratio.',
          correctsTo:
            'Coefficients count MOLES, and each substance weighs a different amount per mole. Convert to moles first (divide by molar mass), apply the mole ratio, then convert back to grams (multiply by the new molar mass) — grams never cross the bridge directly.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A balanced equation is a recipe in MOLES: coefficients give mole ratios, never gram ratios.',
        'Three-step highway: grams A ÷ molar mass A → moles A × mole ratio → moles B × molar mass B → grams B.',
        'Ratio direction: the substance you want goes on top of the conversion factor.',
        'Subscripts build molar mass; coefficients build mole ratios — they are never interchangeable.',
        'Sanity check with conservation of mass: total grams in must equal total grams out.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.4', cedTitle: 'Stoichiometry: Mole Ratios & Mass-Mass Problems' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
