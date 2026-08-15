/**
 * Algebra 1 — Linear Equations: Proportions & Percent Problems.
 *
 * The bridge from middle-school ratio reasoning (CCSS 7.RP) into
 * Algebra 1 equation modeling (A-CED.A.1): translate a rate, a percent,
 * or a percent change into an equation, then solve it with the
 * multi-step routine already in hand. Scaling recipes, unit pricing,
 * markups, discounts, tips and growth rates all reduce to the same two
 * set-ups.
 */

import type { LessonPlan } from '../types';
import { HS_PACING_THRESHOLDS, HS_SOURCE } from './_hs-shared';

export const SEED_ALG1_U2_PROPORTIONS_PERCENTS: LessonPlan = {
  id: 'evelyn.hs.alg1.proportions-percents.v1',
  title: 'Proportions & Percent Problems',
  curriculum: 'HS',
  grade: '9-10',
  subject: 'math',
  topic: 'algebra-1',
  locale: 'en',
  los: [
    {
      id: 'alg1.proportions-percents',
      standard: 'ALG1-2.4',
      description:
        'Set up and solve proportions by cross-multiplication, and write and solve equations for percent of, percent change, and percent increase or decrease situations (CCSS 7.RP.A.2, 7.RP.A.3, A-CED.A.1).',
    },
  ],
  prerequisites: ['alg1.literal-equations'],
  followUps: ['alg1.one-variable-inequalities'],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame proportions and percents as the first place Algebra 1 turns a real situation into an equation you can solve.',
      script:
        'Doubling a recipe, comparing two price tags by the ounce, working out what a jacket cost before the sale — every one of those is the same move: write an equation, then solve it. Proportions and percents are where Algebra 1 stops being about x on a page and starts being about modelling something real. The good news is you already know how to solve the equations. Today is about setting them up so they say what you actually mean.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-setup',
      kind: 'concept',
      goal: 'Cross-multiplication for proportions, the three percent set-ups, and the base errors that wreck otherwise correct arithmetic.',
      keyIdeas: [
        'A PROPORTION IS TWO EQUAL RATIOS — a/b = c/d. Build it so matching units sit in matching positions: miles over hours on the left means miles over hours on the right, never miles over hours equals hours over miles.',
        'CROSS-MULTIPLY — a/b = c/d becomes ad = bc. This is legal because you multiplied both sides by bd; it just converts a fraction equation into the linear equation you already know how to solve.',
        'LABEL EVERY NUMBER when you set up. If the two sides of your proportion do not describe the same unit in the same slot, the equation is wrong before you do any arithmetic.',
        'PERCENT OF — "what is p% of n" translates to (p/100) × n. "x is what percent of y" translates to (x/y) × 100. The whole y always goes in the denominator.',
        'PERCENT PROPORTION — part/whole = percent/100 handles all three question types at once: cross-multiply and solve for whichever piece is missing.',
        'PERCENT CHANGE — increasing by p% means multiplying by (1 + p/100); decreasing by p% means multiplying by (1 − p/100). Percent change itself is (new − old)/old × 100.',
        'ERROR — WRONG BASE: percent change divides by the ORIGINAL value, not the new one. Dropping from 45 to 36 is a 9/45 = 20% decrease, not 9/36 = 25%.',
        'ERROR — WORKING BACKWARDS BY ADDING: if a 15% discount left a price of $68, the original is NOT 68 + 15% of 68. Write 0.85p = 68 and solve for p — the percent was taken of the unknown original, so the unknown belongs in the equation.',
      ],
      vocabulary: [
        { term: 'proportion', definition: 'an equation stating that two ratios are equal, a/b = c/d.' },
        { term: 'unit rate', definition: 'a ratio written with a denominator of 1, such as dollars per ounce or miles per hour.' },
        { term: 'percent change', definition: 'the change divided by the original amount, expressed as a percent.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-proportion',
      kind: 'worked_example',
      problem: 'A 12-ounce bottle of juice costs $2.40. At the same price per ounce, what does a 20-ounce bottle cost?',
      steps: [
        'Set up matching units — ounces over dollars on both sides: 12/2.40 = 20/x.',
        'Cross-multiply: 12x = 2.40 × 20, so 12x = 48.',
        'Divide by 12: x = 4, so the 20-ounce bottle costs $4.00.',
        'Check with the unit rate: $2.40 ÷ 12 oz = $0.20 per ounce, and 20 × $0.20 = $4.00. ✓',
      ],
      answer: '$4.00',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-reverse-percent',
      kind: 'worked_example',
      problem: 'After a 15% discount, a jacket costs $68. What was the original price?',
      steps: [
        'Name the unknown: let p be the original price. The discount was taken of p, so p is what belongs inside the percent.',
        'A 15% discount means the shopper pays 85% of the original: 0.85p = 68.',
        'Divide both sides by 0.85: p = 68 ÷ 0.85 = 80. The original price was $80.',
        'The trap: adding 15% back to $68 gives 68 × 1.15 = $78.20, which is wrong because that takes 15% of the SALE price instead of the original.',
        'Check: 15% of $80 is $12, and $80 − $12 = $68. ✓',
      ],
      answer: 'p = $80',
      estimatedMinutes: 3,
    },
    {
      id: 'try-cross-multiply',
      kind: 'try_yourself',
      problem: 'Solve for x: (x + 2)/6 = 5/3',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: 'x = 8', correct: true },
        { id: 'b', text: 'x = 10' },
        { id: 'c', text: 'x = 28' },
        { id: 'd', text: 'x = 3' },
      ],
      expectedAnswer: 'x = 8',
      hints: [
        'Cross-multiply: 3(x + 2) = 6 × 5.',
        '3(x + 2) = 30 gives x + 2 = 10 — do not stop there, the question asks for x.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-percent-equation',
      kind: 'try_yourself',
      problem: 'A laptop price was increased by 12%, and the new price is $560. Which equation correctly finds the original price p?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '0.88p = 560' },
        { id: 'b', text: '1.12p = 560', correct: true },
        { id: 'c', text: 'p = 560 × 1.12' },
        { id: 'd', text: 'p + 12 = 560' },
      ],
      expectedAnswer: '1.12p = 560',
      hints: [
        'The 12% was taken of the ORIGINAL price, so the unknown p is what gets multiplied.',
        'An increase of 12% multiplies by (1 + 0.12). Which side of the equation is the $560 on?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-percent-numeric',
      kind: 'try_yourself',
      problem: 'A shirt is marked down from $45 to $36. What is the percent decrease? Type your answer as a number only (no percent sign).',
      responseFormat: 'numeric',
      expectedAnswer: '20',
      hints: [
        'Percent change = (new − old)/old × 100 — the denominator is the ORIGINAL price.',
        'The change is $45 − $36 = $9, so compute 9/45 × 100.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-increase-then-decrease',
      kind: 'misconception_check',
      question: 'A student says that raising a price by 20% and then lowering the new price by 20% brings it back to where it started. Is that right?',
      commonErrors: [
        {
          answer: 'Yes — the price returns to the original value',
          misconception: 'Treating an increase and an equal-sized decrease as opposites that cancel, as if both percents were taken of the same number.',
          correctsTo:
            'They do not cancel, because the second percent is taken of a bigger base. Start at $100: the increase gives 100 × 1.20 = $120, then the decrease gives 120 × 0.80 = $96 — a 4% net loss, not a return to $100. Combine percent changes by multiplying the factors: 1.20 × 0.80 = 0.96.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'A proportion is a/b = c/d with matching units in matching slots; cross-multiply to ad = bc, then solve as usual.',
        'Percent proportion: part/whole = percent/100 covers percent of, percent is, and find-the-whole.',
        'Percent change divides by the ORIGINAL value: (new − old)/old × 100.',
        'To undo a percent change, put the unknown in the equation: a 15% discount to $68 is 0.85p = 68, not 68 + 15% of 68.',
        'Percent changes multiply, they do not add: 1.20 × 0.80 = 0.96, so up 20% then down 20% loses 4%.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: HS_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.4', cedTitle: 'Proportions & Percent Problems' },
  pacingThresholds: HS_PACING_THRESHOLDS,
};
