/**
 * ACT — Math: Pre-Algebra Review — Fractions, Percents & Ratios.
 *
 * Pre-algebra (fractions, percentages, ratios) is one of the highest-yield
 * ACT Math content areas — roughly a quarter of the 60 questions draw on
 * it, concentrated in the easier first third of the section. Calculator
 * is allowed throughout; the pace target is 60 seconds per question. The
 * traps here are conceptual (compounding percentages, part-to-whole vs.
 * part-to-part ratios), not computational — the arithmetic itself is
 * simple once the set-up is right.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_ACT_U2_PREALGEBRA_REVIEW: LessonPlan = {
  id: 'evelyn.testprep.act.prealgebra-review.v1',
  title: 'Pre-Algebra: Fractions, Percents & Ratios',
  curriculum: 'ACT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'act',
  locale: 'en',
  los: [
    {
      id: 'act.prealgebra-review',
      standard: 'ACT-2.1',
      description:
        'Solve ACT-style fraction, percent-change, and ratio problems accurately and quickly, avoiding the compounding-percent and part-to-whole traps that cause most errors on this content.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Reframe pre-algebra as high-yield, low-difficulty ACT points if the traps are known.',
      script:
        'Fractions, percents, and ratios show up in roughly a quarter of ACT Math questions, and they cluster in the easier first third of the section. That means this is some of the fastest points on the whole test — if you know the two or three traps the ACT reuses over and over. Pace target: about 60 seconds per question. Today we drill the set-ups, not just the arithmetic.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-prealgebra',
      kind: 'concept',
      goal: 'Core percent and ratio moves, plus the recurring traps that turn easy questions into missed points.',
      keyIdeas: [
        'PERCENT OF: "x is what percent of y" → (x / y) × 100. Always divide by the ORIGINAL whole, not by x.',
        'PERCENT CHANGE: increasing by p% means multiply by (1 + p/100); decreasing by p% means multiply by (1 − p/100). Never just add or subtract p from 100.',
        'TRAP — SEQUENTIAL PERCENTS COMPOUND, NOT ADD: two discounts of 20% and 10% do NOT combine to 30% off. Multiply the "keep" fractions: 0.80 × 0.90 = 0.72, so it is really 28% off.',
        'TRAP — INCREASE THEN DECREASE DOES NOT CANCEL: a 20% increase followed by a 20% decrease does not return to the original value, because the second percentage is taken of a different (larger) base.',
        'FRACTIONS: common denominator to add/subtract; multiply straight across (numerator × numerator, denominator × denominator); divide by multiplying by the reciprocal.',
        'RATIOS: a:b means a parts to b parts. Total parts = a + b. Find the value of ONE part by dividing a given total by the total parts, then scale up.',
        'TRAP — PART-TO-WHOLE vs. PART-TO-PART: a ratio of 3:5 means the first quantity is 3/8 of the whole (not 3/5) — the whole is a + b parts, not just the other term.',
        'CALCULATOR is allowed throughout ACT Math — use it for the arithmetic, but set up the fraction/percent/ratio relationship on paper first so you calculate the right thing.',
      ],
      vocabulary: [
        { term: 'percent change', definition: 'the multiplier (1 ± p/100) applied to a starting value to reflect an increase or decrease of p percent.' },
        { term: 'ratio', definition: 'a comparison of two quantities by division, written a:b, where the whole is a + b parts.' },
        { term: 'part-to-whole', definition: 'a fraction comparing one part of a ratio to the total of all parts, as opposed to comparing one part to another part.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-sequential-percent',
      kind: 'worked_example',
      problem:
        'A $50 shirt is marked down 20%. At checkout, an additional 10% off the marked-down price is applied. What is the final price, and what is the total percent discount from $50?',
      steps: [
        'After the 20% markdown: $50 × (1 − 0.20) = $50 × 0.80 = $40.',
        'After the additional 10% off the marked-down price: $40 × (1 − 0.10) = $40 × 0.90 = $36.',
        'Trap check: the total discount is NOT 20% + 10% = 30%. Compute it from the combined multiplier instead: 0.80 × 0.90 = 0.72, so the customer pays 72% of $50 and the total discount is 28%.',
        'Sanity-check: $50 × 0.72 = $36, matching the step-by-step result. ✓',
      ],
      answer: '$36 (a total discount of 28%, not 30%)',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-ratio-trap',
      kind: 'worked_example',
      problem:
        'A fruit basket contains only apples and oranges in the ratio 4:7. If there are 33 pieces of fruit in the basket, how many are oranges?',
      steps: [
        'Total parts in the ratio: 4 + 7 = 11.',
        'Value of one part: 33 total ÷ 11 parts = 3 pieces of fruit per part.',
        'Oranges = 7 parts × 3 = 21.',
        'Trap avoided: a student who treats 7:4 as "7/4 of the apple count" or scales 33 by 7/4 gets a non-integer, impossible answer — the ratio numbers describe PARTS OF THE WHOLE (11 parts), not a part-to-part multiplier on the total.',
        'Sanity-check: apples = 4 × 3 = 12; 12 + 21 = 33. ✓',
      ],
      answer: '21 oranges',
      estimatedMinutes: 3,
    },
    {
      id: 'try-percent-discount',
      kind: 'try_yourself',
      problem: 'A jacket originally priced at $60 is discounted by 15%. What is the sale price?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$9' },
        { id: 'b', text: '$45' },
        { id: 'c', text: '$51', correct: true },
        { id: 'd', text: '$69' },
      ],
      expectedAnswer: '$51',
      hints: ['A 15% discount means the customer pays 85% of the original price.', 'Multiply $60 by 0.85.'],
      estimatedMinutes: 2,
    },
    {
      id: 'try-sequential-percent',
      kind: 'try_yourself',
      problem:
        'A phone priced at $200 is discounted 25%. During a flash sale, the sale price is discounted another 10%. What is the final price?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$130' },
        { id: 'b', text: '$135', correct: true },
        { id: 'c', text: '$140' },
        { id: 'd', text: '$150' },
      ],
      expectedAnswer: '$135',
      hints: [
        'Sequential percentages compound — apply each discount to the RESULT of the previous one, not to the original price.',
        '$200 × 0.75 × 0.90 = ?',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-ratio-numeric',
      kind: 'try_yourself',
      problem: 'Type your answer: In a garden, the ratio of tulips to daisies is 5:3. If there are 24 daisies, how many tulips are there?',
      responseFormat: 'numeric',
      expectedAnswer: '40',
      hints: [
        'The daisies correspond to 3 parts of the ratio — find the value of one part first.',
        '24 daisies ÷ 3 parts = 8 per part, so tulips = 5 × 8.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-increase-decrease',
      kind: 'misconception_check',
      question:
        'A student reasons that a 20% price increase followed by a 20% price decrease brings the price back to where it started. Why is this wrong?',
      commonErrors: [
        {
          answer: 'The price returns to the original value',
          misconception: 'Treating a percent increase and an equal-sized percent decrease as inverses that cancel out.',
          correctsTo:
            'They do not cancel, because the decrease is taken of a DIFFERENT (larger) base. Starting at $100: a 20% increase gives $100 × 1.20 = $120. A 20% decrease from there gives $120 × 0.80 = $96 — not $100. Every percent change must be applied to the CURRENT value, not the original one.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Percent change = multiply by (1 ± p/100); sequential percentages compound (multiply the keep-fractions), they never simply add.',
        'A p% increase followed by a p% decrease does NOT return to the original value — the base changes at each step.',
        'Ratios describe parts of a whole: for a:b, the whole is a + b parts — find the value of one part, then scale.',
        'Pre-algebra questions cluster in the easier first third of ACT Math — bank these at well under the 60-second/question pace.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '2', cedTopic: '2.1', cedTitle: 'Pre-Algebra: Fractions, Percents & Ratios' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
