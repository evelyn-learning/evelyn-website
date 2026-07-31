/**
 * Chemistry — The Mole & Stoichiometry: Limiting Reactants & Percent Yield.
 *
 * Which ingredient runs out first, and how much of the promised product
 * actually reaches the bottle (NGSS HS-PS1-7). The two star errors get
 * full worked examples: comparing raw moles without dividing by the
 * coefficient, and comparing raw masses instead of moles. Every number is
 * chosen so the arithmetic lands clean.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_CHEM_U6_LIMITING_REACTANT_YIELD: LessonPlan = {
  id: 'evelyn.hs.chem.limiting-reactant-yield.v1',
  title: 'Limiting Reactants & Percent Yield',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'science',
  topic: 'chemistry',
  locale: 'en',
  los: [
    {
      id: 'chem.limiting-reactant-yield',
      standard: 'CHEM-6.5',
      description:
        'Identify the limiting and excess reactants in a chemical reaction, calculate the theoretical yield of product, and compute percent yield from an actual yield (NGSS HS-PS1-7).',
    },
  ],
  prerequisites: ['chem.mass-mass-stoichiometry'],
  followUps: ['chem.kinetic-molecular-theory'],
  estimatedMinutes: 20,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reactions stop when an ingredient runs out — and industry lives or dies on how much of the promised product actually shows up.',
      script:
        'You have 10 slices of bread and 3 slices of cheese. How many grilled cheese sandwiches can you make? Three — and then you are staring at 4 useless slices of bread. The cheese LIMITED you. Chemical reactions work exactly the same way, and this is not a party trick: a drug plant will deliberately dump in a cheap reactant by the barrel so that not one gram of the expensive one is wasted. Then comes the honest question every chemist has to answer — the math promised 60 grams of product, the bottle holds 45. Today you learn to find the ingredient that runs out first, predict the maximum product, and grade the reaction against that promise.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-limiting-yield',
      kind: 'concept',
      goal: 'The divide-by-coefficient test for the limiting reactant, theoretical yield from that reactant only, and percent yield as the reaction report card.',
      keyIdeas: [
        'THE LIMITING REACTANT RUNS OUT FIRST — it caps how much product can form. The moment it is gone the reaction stops, no matter how much of everything else is still sitting in the flask. Everything else is the EXCESS reactant, and its leftovers are simply what did not get used.',
        'THE TEST: MOLES ÷ COEFFICIENT — convert each reactant\'s mass to moles (divide by molar mass), then divide those moles by that reactant\'s coefficient in the balanced equation. The SMALLEST quotient is the limiting reactant. That quotient counts how many times the recipe can run.',
        'NEVER COMPARE RAW MOLES — 1.50 mol of H₂ is more than 1.00 mol of N₂, yet in N₂ + 3 H₂ → 2 NH₃ the H₂ still runs out first, because each batch eats THREE H₂ for every one N₂. The coefficient is the appetite; you must divide it out before comparing.',
        'NEVER COMPARE RAW GRAMS — grams say nothing about particle count. 3.0 g of H₂ is 1.50 mol of molecules; 28.0 g of N₂ is only 1.00 mol. The lighter pile can easily hold more particles, so mass ranking is meaningless here.',
        'THEORETICAL YIELD — the maximum product mass, computed from the LIMITING reactant only, using the same grams → moles → mole ratio → grams highway from the last lesson. Feed the excess reactant into that calculation and your answer will be too big.',
        'ACTUAL YIELD IS MEASURED, NOT CALCULATED — it is what you weigh after the product is isolated and dried. Reactions run in reverse, side reactions steal reactant, and product clings to the filter paper, so the actual yield is essentially always less than theoretical.',
        'PERCENT YIELD = (actual ÷ theoretical) × 100 — the reaction\'s report card, and both masses must be for the SAME substance in the SAME units. A yield above 100% is not a triumph; it is a signal of impurity, usually leftover solvent or water still in the product.',
        'LEFTOVER EXCESS — to find how much excess reactant survives: from the limiting reactant\'s moles, use the mole ratio to find how many moles of the excess were CONSUMED, convert to grams, and subtract from the starting mass.',
      ],
      vocabulary: [
        { term: 'limiting reactant', definition: 'the reactant that is completely consumed first; it sets the maximum amount of product.' },
        { term: 'theoretical yield', definition: 'the product mass predicted from the limiting reactant assuming the reaction goes perfectly to completion.' },
        { term: 'percent yield', definition: 'actual yield divided by theoretical yield, times 100 — how efficient the reaction actually was.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-limiting-theoretical',
      kind: 'worked_example',
      problem:
        'Ammonia is made industrially by N₂ + 3 H₂ → 2 NH₃. A reactor is charged with 28.0 g of N₂ and 3.0 g of H₂. Which reactant is limiting, and what is the theoretical yield of NH₃? Molar masses: N₂ = 28.0 g/mol, H₂ = 2.0 g/mol, NH₃ = 17.0 g/mol.',
      steps: [
        'Step 1 — grams to moles for BOTH reactants: 28.0 g N₂ ÷ 28.0 g/mol = 1.00 mol N₂; 3.0 g H₂ ÷ 2.0 g/mol = 1.50 mol H₂.',
        'Step 2 — divide each by its coefficient: N₂ is 1.00 ÷ 1 = 1.00; H₂ is 1.50 ÷ 3 = 0.50. The recipe can only run 0.50 times before hydrogen is gone.',
        'Step 3 — smallest quotient wins: H₂ is the LIMITING reactant, even though there are more moles of it. N₂ is in excess.',
        'Step 4 — theoretical yield from the limiting reactant only: 1.50 mol H₂ × (2 mol NH₃ / 3 mol H₂) = 1.00 mol NH₃, then 1.00 mol × 17.0 g/mol = 17.0 g NH₃.',
        'Check the leftover: H₂ consumed 1.50 × (1 mol N₂ / 3 mol H₂) = 0.50 mol N₂ = 14.0 g. Starting 28.0 g minus 14.0 g used leaves 14.0 g of N₂ sitting unreacted in the vessel.',
      ],
      answer: 'H₂ is limiting; theoretical yield is 17.0 g of NH₃, with 14.0 g of N₂ left over',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-raw-moles-trap',
      kind: 'worked_example',
      problem:
        'For the same reactor (N₂ + 3 H₂ → 2 NH₃; 1.00 mol N₂ and 1.50 mol H₂), a student says: "N₂ is limiting — there is only 1.00 mol of it and 1.50 mol of H₂, so nitrogen runs out first." The plant then isolates 13.6 g of NH₃. Diagnose the student\'s error and find the true percent yield.',
      steps: [
        'Name the move: the student compared RAW moles and skipped the divide-by-coefficient step, which is the whole point of the test.',
        'Why it fails: the balanced equation eats hydrogen three times faster than nitrogen. Dividing out that appetite gives N₂ at 1.00 ÷ 1 = 1.00 and H₂ at 1.50 ÷ 3 = 0.50 — hydrogen supports only half a batch, so H₂ is limiting.',
        'Cost of the error: from N₂ the student would predict 1.00 mol N₂ × (2 mol NH₃ / 1 mol N₂) = 2.00 mol = 34.0 g NH₃ — exactly double the real theoretical yield of 17.0 g.',
        'Percent yield with the CORRECT theoretical yield: (13.6 g ÷ 17.0 g) × 100 = 80. The reaction ran at 80% efficiency.',
        'Percent yield with the student\'s inflated theoretical yield would have been (13.6 ÷ 34.0) × 100 = 40 — a perfectly good reaction misreported as a failure. Picking the wrong limiting reactant poisons every number downstream.',
      ],
      answer: 'H₂ is limiting, not N₂; theoretical yield 17.0 g, so the percent yield is 80%',
      estimatedMinutes: 3,
    },
    {
      id: 'try-identify-limiting',
      kind: 'try_yourself',
      problem:
        'Aluminum burns in chlorine: 2 Al + 3 Cl₂ → 2 AlCl₃. A flask contains 2.0 mol of Al and 2.0 mol of Cl₂. Which reactant is limiting?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'Cl₂ — dividing by coefficients gives 2.0/2 = 1.0 for Al but 2.0/3 ≈ 0.67 for Cl₂', correct: true },
        { id: 'b', text: 'Al — its coefficient (2) is smaller than the coefficient of Cl₂ (3)' },
        { id: 'c', text: 'Neither — the moles are equal, so both run out at the same time' },
        { id: 'd', text: 'It cannot be decided without converting both amounts into grams' },
      ],
      expectedAnswer: 'Cl₂ — dividing by coefficients gives 2.0/2 = 1.0 for Al but 2.0/3 ≈ 0.67 for Cl₂',
      hints: [
        'Equal moles does not mean equal supply — the equation consumes them at different rates. Divide each amount by that reactant\'s coefficient.',
        '2.0 ÷ 2 versus 2.0 ÷ 3: which quotient is smaller? The smaller quotient is the reactant that runs out first.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-yield-above-100',
      kind: 'try_yourself',
      problem:
        'A student finishes a synthesis, weighs the product, and calculates a percent yield of 112%. What is the most likely explanation?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'The product was still wet — leftover solvent or water added mass that is not product', correct: true },
        { id: 'b', text: 'The reaction was unusually efficient and made more product than the mole ratio allows' },
        { id: 'c', text: 'The excess reactant also turned into product once the limiting reactant ran out' },
        { id: 'd', text: 'Percent yields above 100% are normal whenever a reaction releases heat' },
      ],
      expectedAnswer: 'The product was still wet — leftover solvent or water added mass that is not product',
      hints: [
        'Theoretical yield is the ceiling set by conservation of mass and the mole ratio — atoms cannot be created, so the true product mass cannot exceed it.',
        'If the calculated value beats the ceiling, the number on the balance must include something that is not product.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-numeric',
      kind: 'try_yourself',
      problem:
        'A chemist synthesizes aspirin. Working from the limiting reactant, the theoretical yield is 60.0 g. After filtering and fully drying the product, the balance reads 45.0 g. What is the percent yield? Type your answer as a number, without the percent sign.',
      responseFormat: 'numeric',
      expectedAnswer: '75',
      hints: [
        'Percent yield = (actual yield ÷ theoretical yield) × 100.',
        '45.0 ÷ 60.0 = 0.75, and then multiply by 100.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-smaller-mass',
      kind: 'misconception_check',
      question:
        'A student is given 28.0 g of N₂ and 3.0 g of H₂ for N₂ + 3 H₂ → 2 NH₃ and says: "There are only 3.0 grams of hydrogen and 28.0 grams of nitrogen, so obviously hydrogen is limiting — it is the smaller pile." The conclusion happens to be right. Why is the reasoning still wrong?',
      commonErrors: [
        {
          answer: 'The reactant with the smaller mass is the limiting one',
          misconception: 'Ranking reactants by grams instead of by moles ÷ coefficient — treating mass as if it counted particles.',
          correctsTo:
            'Grams do not count particles. Those 3.0 g of H₂ are 1.50 mol of molecules while 28.0 g of N₂ are only 1.00 mol — the lighter pile holds MORE particles. Hydrogen is limiting only because 1.50 ÷ 3 = 0.50 beats 1.00 ÷ 1 = 1.00, not because 3.0 is less than 28.0. Change the amounts to 28.0 g N₂ and 12.0 g H₂ and the mass rule gives the wrong answer: 6.00 ÷ 3 = 2.00 versus 1.00 ÷ 1 = 1.00, so now N₂ is limiting despite being the heavier pile. Always convert to moles, then divide by the coefficient.',
        },
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'The limiting reactant runs out first and caps the product; everything else is excess and leaves leftovers.',
        'The test is moles ÷ coefficient for every reactant — the smallest quotient is limiting. Never rank by raw moles, never rank by grams.',
        'Theoretical yield comes from the limiting reactant alone, through grams → moles → mole ratio → grams.',
        'Percent yield = (actual ÷ theoretical) × 100, with both masses for the same substance in the same units.',
        'Above 100% means contamination — usually a product that was never fully dried — not a super-efficient reaction.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '6', cedTopic: '6.5', cedTitle: 'Limiting Reactants & Percent Yield' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
