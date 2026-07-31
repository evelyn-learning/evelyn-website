/**
 * Chemistry — Solutions: Molarity & Solution Concentration.
 *
 * Concentration as moles of solute per LITER of solution (NGSS HS-PS1-7,
 * SEP-5): the grams → moles → divide-by-liters pathway, the volume-of-
 * SOLUTION vs volume-of-solvent distinction, and the star error — leaving
 * the volume in milliliters, which shrinks every answer by a factor of 1000.
 * Numbers are chosen so every molarity lands on a clean value.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U8_MOLARITY: LessonPlan = {
  id: 'evelyn.hs.chem.molarity.v1',
  title: 'Molarity & Solution Concentration',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.molarity',
      standard: 'CHEM-8.2',
      description:
        'Calculate the molarity of a solution from the moles or mass of solute and the volume of solution, and use molarity to find the amount of solute needed to prepare a solution of a target concentration (NGSS HS-PS1-7, SEP-5).',
    },
  ],
  prerequisites: ['chem.solutions-solubility'],
  followUps: ['chem.dilutions-colligative'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Concentration as the number that decides whether a solution heals, cleans, or kills — and why chemists count solute in moles, not spoonfuls.',
      script:
        'The saline bag hanging next to a hospital bed is 0.15 M NaCl. Push in something twice that concentration and red blood cells shrivel; half of it and they burst. Same two ingredients, salt and water — only the RATIO changes, and that ratio is the difference between medicine and harm. Chemists pin that ratio down with one number: molarity, moles of solute per liter of solution. Today you learn to compute it, to build a solution to a target concentration, and to avoid the one slip that wrecks more concentration answers than anything else — leaving the volume in milliliters.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-molarity',
      kind: 'concept',
      goal: 'The definition M = mol solute / L solution, the grams-to-moles on-ramp, the solution-vs-solvent volume rule, and the milliliter trap.',
      keyIdeas: [
        'THE DEFINITION — molarity (M) = moles of SOLUTE ÷ LITERS of SOLUTION. A 2 M solution means 2 moles of dissolved substance in every 1 liter of finished solution. The unit "M" is read "molar" and literally means mol/L.',
        'WHY MOLES, NOT GRAMS — reactions happen particle-by-particle, so a concentration that counts PARTICLES (moles) tells you how much reaction the solution can drive. Grams per liter would give sugar and salt the same "strength" at equal mass, which is chemically false.',
        'THE GRAMS ON-RAMP — if the solute is given in grams, convert first: moles = grams ÷ molar mass. Only then divide by liters. Two conversions, always in this order: grams → moles, mL → L, then divide.',
        'THE TRAP: MILLILITERS IN THE DENOMINATOR — molarity is per LITER. Dividing by 250 instead of 0.250 makes the answer 1000 times too small. Convert mL → L by dividing by 1000 BEFORE you divide, every single time. If your molarity comes out around 0.001 for an ordinary lab solution, you almost certainly forgot this step.',
        'VOLUME OF SOLUTION, NOT OF SOLVENT — the liters in the denominator are the TOTAL finished volume, not the water you poured in. That is why solutions are made in a volumetric flask: dissolve the solute in some water first, then add water up to the etched mark. Dissolved solute takes up space, so "1 mole plus 1 liter of water" is NOT a 1 M solution.',
        'RUNNING THE FORMULA BACKWARD — M = mol/L rearranges to moles = M × L. That is the recipe form: to prepare a solution, multiply target molarity by target volume in liters to get the moles you need, then multiply by molar mass to get grams to weigh out.',
        'CONCENTRATION IS INTENSIVE — scooping half the beaker out does not change the molarity. A 3 M solution is 3 M whether you have 10 mL of it or 10 L; both moles and liters halve together. Amount of solute changes with volume, concentration does not.',
      ],
      vocabulary: [
        { term: 'molarity', definition: 'concentration expressed as moles of solute per liter of solution, symbol M.' },
        { term: 'solute', definition: 'the substance being dissolved, whose moles sit in the numerator of molarity.' },
        { term: 'volumetric flask', definition: 'glassware calibrated to one exact total volume, used to bring a solution up to its final mark.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-grams-to-molarity',
      kind: 'worked_example',
      problem:
        'A student dissolves 11.7 g of NaCl in water and fills the flask to a total volume of 500 mL. What is the molarity of the solution? Molar masses: Na = 23.0, Cl = 35.5 g/mol.',
      steps: [
        'Step 1 — grams to moles (the on-ramp): molar mass of NaCl = 23.0 + 35.5 = 58.5 g/mol, so 11.7 g ÷ 58.5 g/mol = 0.200 mol NaCl.',
        'Step 2 — milliliters to liters: 500 mL ÷ 1000 = 0.500 L. Do this BEFORE dividing, not after.',
        'Step 3 — divide: M = 0.200 mol ÷ 0.500 L = 0.400 mol/L.',
        'Sanity check: 0.200 mol sits in half a liter, so a full liter would hold twice as much — 0.4 mol per liter. The answer should be BIGGER than the mole count whenever the volume is under a liter. ✓',
      ],
      answer: '0.40 M NaCl',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-milliliter-trap',
      kind: 'worked_example',
      problem:
        'For the same solution (0.200 mol of NaCl in 500 mL), a student writes M = 0.200 ÷ 500 = 0.0004 M. The true answer is 0.40 M. Diagnose the error and show the repair.',
      steps: [
        'Name the move: the student divided by 500 MILLILITERS. Molarity is defined per LITER, so the denominator must be in liters — the units of the formula were never satisfied.',
        'Measure the damage: 500 mL is 0.500 L, and 500 is exactly 1000 times larger than 0.500. Dividing by a number 1000 times too big makes the answer 1000 times too small — 0.0004 instead of 0.40.',
        'Catch it by smell: 0.0004 M would be an extraordinarily dilute solution, more dilute than tap water is in most dissolved salts. Half a gram-scale scoop of salt in half a beaker is an ordinary, roughly-tenths-of-a-molar solution. An answer near 0.001 from ordinary lab quantities is the milliliter signature.',
        'The repair: convert first — 500 mL ÷ 1000 = 0.500 L — then divide: 0.200 mol ÷ 0.500 L = 0.400 M. Write the unit on every number as you go and the mismatch becomes impossible to miss.',
      ],
      answer: '0.40 M — the volume must be converted to liters before dividing; mL in the denominator shrinks the answer 1000-fold',
      estimatedMinutes: 3,
    },
    {
      id: 'try-molarity-mcq',
      kind: 'try_yourself',
      problem:
        'What is the molarity of a solution made by dissolving 1.0 mol of KCl in enough water to make 500 mL of solution?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '2.0 M', correct: true },
        { id: 'b', text: '0.002 M' },
        { id: 'c', text: '0.50 M' },
        { id: 'd', text: '500 M' },
      ],
      expectedAnswer: '2.0 M',
      hints: [
        'Molarity is moles per LITER. Convert 500 mL to liters first.',
        '500 mL = 0.500 L, so divide 1.0 mol by 0.500 L — the answer must be larger than 1, because a full liter would hold more solute than half a liter does.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-preparation-mcq',
      kind: 'try_yourself',
      problem:
        'You need to prepare 1.0 L of 0.10 M glucose solution. Which laboratory procedure gives the correct concentration?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Dissolve 0.10 mol of glucose in some water in a 1.0 L volumetric flask, then add water up to the 1.0 L mark', correct: true },
        { id: 'b', text: 'Add 0.10 mol of glucose to a full 1.0 L of water and stir' },
        { id: 'c', text: 'Dissolve 0.10 g of glucose in water and fill to the 1.0 L mark' },
        { id: 'd', text: 'Dissolve 1.0 mol of glucose in water and fill to the 0.10 L mark' },
      ],
      expectedAnswer: 'Dissolve 0.10 mol of glucose in some water in a 1.0 L volumetric flask, then add water up to the 1.0 L mark',
      hints: [
        'The denominator of molarity is the volume of the finished SOLUTION, not the volume of water you started with.',
        'Two choices confuse moles with grams or invert the numbers; one adds solute to a full liter of water, which pushes the total past 1.0 L and dilutes the result.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A chemist dissolves 20.0 g of NaOH in water and fills the flask to a total volume of 250 mL. What is the molarity of the solution in mol/L? Molar masses: Na = 23.0, O = 16.0, H = 1.0 g/mol. Type your answer as a number.',
      responseFormat: 'numeric',
      expectedAnswer: '2',
      hints: [
        'First find the molar mass of NaOH by adding 23.0 + 16.0 + 1.0, then convert 20.0 g to moles.',
        '20.0 g ÷ 40.0 g/mol = 0.500 mol. Now convert 250 mL to liters (0.250 L) before dividing — 0.500 ÷ 0.250 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-ml-denominator',
      kind: 'misconception_check',
      question:
        'A student reports that dissolving 0.50 mol of sugar in 200 mL of solution gives a concentration of 0.0025 M. The number is arithmetically correct for what they typed — so what went wrong, and what is the real molarity?',
      commonErrors: [
        {
          answer: '0.50 ÷ 200 = 0.0025 M',
          misconception: 'Plugging the volume into M = mol/V in milliliters, as if the formula accepted any volume unit.',
          correctsTo:
            'Molarity is defined as moles per LITER, so the volume must be converted first: 200 mL ÷ 1000 = 0.200 L. Then M = 0.50 mol ÷ 0.200 L = 2.5 M — exactly 1000 times the student\'s value. Any ordinary lab solution landing near 0.001 M is the fingerprint of an un-converted milliliter volume.',
        },
        {
          answer: 'Molarity uses the volume of water added',
          misconception: 'Treating the solvent volume as the denominator instead of the total finished solution volume.',
          correctsTo:
            'The denominator is the TOTAL volume of solution after the solute dissolves. Dissolved particles occupy space, so water added and solution produced are different volumes — which is why solutions are brought up to the mark in a volumetric flask rather than mixed into a pre-measured liter of water.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Molarity M = moles of solute ÷ LITERS of solution; the unit M is read "molar" and means mol/L.',
        'If the solute is in grams, convert to moles first (grams ÷ molar mass); if the volume is in mL, divide by 1000 first.',
        'The star error: leaving the volume in milliliters makes the answer 1000 times too small — an ordinary solution reading ~0.001 M is the tell.',
        'The denominator is the total volume of SOLUTION, not the volume of solvent added — hence the volumetric flask and its mark.',
        'Run it backward to prepare a solution: moles = M × L, then grams = moles × molar mass.',
        'Concentration is intensive: taking out half the beaker leaves the molarity unchanged.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '8', cedTopic: '8.2', cedTitle: 'Molarity & Solution Concentration' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
