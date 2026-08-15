/**
 * Digital SAT — Math / Problem-Solving and Data Analysis: Percentages.
 *
 * Percent problems are the most recurring calculation type within PSDA.
 * The arithmetic itself is trivial; the digital SAT hides two specific
 * traps in nearly every percent item: chaining sequential percent changes
 * (they multiply, they don't add) and running a percent change in reverse
 * (given the value AFTER a change, recover the value BEFORE it). Desmos is
 * allowed on every math question — teach when typing the multiplier chain
 * in directly beats doing it by hand.
 */

import type { LessonPlan } from '../types';
import { TESTPREP_PACING_THRESHOLDS, TESTPREP_SOURCE } from './_testprep-shared';

export const SEED_DSAT_U3_PERCENTAGES: LessonPlan = {
  id: 'evelyn.testprep.dsat.percentages.v1',
  title: 'Percentages',
  curriculum: 'SAT',
  grade: 'sat-act',
  subject: 'test-prep',
  topic: 'digital-sat',
  locale: 'en',
  los: [
    {
      id: 'dsat.percentages',
      standard: 'DSAT-3.2',
      description:
        'Compute percent of, percent change, and percent-change chains; recover an original value from a final value via reverse percentage.',
    },
  ],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 21,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Frame percentages as the most recurring PSDA calculation on the digital SAT, and name the two traps up front.',
      script:
        'Problem-Solving and Data Analysis is about 15 percent of SAT Math, and percent problems are its most recurring calculation — almost every test has multiple percent-change questions. The math itself is one formula, but the SAT hides two specific traps in nearly every problem: chaining changes together and running the change in reverse. Learn both and percent problems become guaranteed points.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-traps',
      kind: 'concept',
      goal: 'The percent-of and percent-change formulas plus the two SAT traps: multiplicative chains and reverse percentage.',
      keyIdeas: [
        'PERCENT OF: "p% of x" = (p/100) × x. 15% of $400 = 0.15 × 400 = $60.',
        'PERCENT CHANGE FORMULA: (new − old) / old × 100. Always divide by the ORIGINAL value — dividing by the new value instead is the single most common percent mistake on the test.',
        'INCREASE BY p%: multiply the original by (1 + p/100). DECREASE BY p%: multiply by (1 − p/100). A 20% discount is × 0.80, not "subtract 20 from the price."',
        'TRAP — PERCENT-CHANGE CHAINS. Sequential changes MULTIPLY their multipliers; they do NOT add. A 10% increase then a 10% decrease is × 1.10 × 0.90 = × 0.99 — a 1% net DECREASE, not 0%.',
        'TRAP — REVERSE PERCENTAGE. When the question gives the value AFTER a change and asks for the value BEFORE it, divide by the multiplier — never subtract the percent from the final value. "After a 20% discount the price is $48" means original × 0.80 = 48, so original = 48 / 0.80 = $60 (NOT 48 + 0.20 × 48).',
        'PERCENT vs PERCENTAGE POINTS — when a rate itself changes (e.g., an interest rate goes from 4% to 6%), "increased by 2 percentage points" is NOT the same as "increased by 2%" (which would be 4% × 1.02 ≈ 4.08%). Read which one the question asks for.',
        'DESMOS CHECK — the calculator is available on every math question. For a multi-step chain, type the multiplier chain directly (e.g., 60*1.25*0.8) instead of computing each step by hand.',
      ],
      vocabulary: [
        { term: 'percent change', definition: '(new − old) / old × 100; always computed relative to the ORIGINAL value.' },
        { term: 'multiplier', definition: 'the single factor (1 ± p/100) that applies a percent change in one multiplication.' },
        { term: 'percentage point', definition: 'a unit for the raw difference between two percentages, distinct from a percent change of one relative to the other.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-chain',
      kind: 'worked_example',
      problem:
        'A store raises the price of a $60 item by 25%, then marks it down 20% for a clearance sale. What is the final price?',
      steps: [
        'First change: +25% → multiply by 1.25. New price = 60 × 1.25 = $75.',
        'Second change: −20% → multiply by 0.80. Final price = 75 × 0.80 = $60.',
        'Check by multiplying the multipliers directly: 1.25 × 0.80 = 1.00 — the two changes exactly cancel, so the final price equals the ORIGINAL $60. A 25% increase paired with a 20% decrease is a classic "looks like it should cancel" pair — verify by multiplying, never assume opposite percents cancel.',
      ],
      answer: '$60',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-reverse',
      kind: 'worked_example',
      problem: 'After a 20% discount, a jacket\'s sale price is $48. What was the original price?',
      steps: [
        'The $48 is the price AFTER a 20% discount, so original × 0.80 = 48.',
        'Divide both sides by 0.80: original = 48 / 0.80 = $60.',
        'Check: $60 × 0.80 = $48. ✓ A common wrong move is computing 48 + 0.20 × 48 = $57.60 — that mistakenly applies the 20% to the SALE price instead of undoing it from the original.',
      ],
      answer: '$60',
      estimatedMinutes: 3,
    },
    {
      id: 'try-chain',
      kind: 'try_yourself',
      problem:
        'A gym\'s monthly fee starts at $50. The gym raises the fee by 10%, then raises the new fee by another 10% the following year. What is the fee after both increases?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$60.00' },
        { id: 'b', text: '$60.50', correct: true },
        { id: 'c', text: '$61.00' },
        { id: 'd', text: '$65.00' },
      ],
      expectedAnswer: '$60.50',
      hints: [
        'Compute the multiplier for one 10% increase, then apply it twice — don\'t just add 10% + 10%.',
        '1.10 × 1.10 = 1.21. Apply that single multiplier to $50: 50 × 1.21.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-reverse',
      kind: 'try_yourself',
      problem:
        'After a 15% increase, a company\'s annual revenue is $460,000. What was the revenue before the increase?',
      responseFormat: 'mcq',
      choices: [
        { id: 'a', text: '$391,000' },
        { id: 'b', text: '$400,000', correct: true },
        { id: 'c', text: '$445,000' },
        { id: 'd', text: '$529,000' },
      ],
      expectedAnswer: '$400,000',
      hints: [
        'The $460,000 is AFTER the increase — set up original × 1.15 = 460,000.',
        'Divide both sides by 1.15: original = 460,000 / 1.15 = 400,000.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'try-spr',
      kind: 'try_yourself',
      problem:
        'Student-produced response (type your answer): a price is increased by 30% and then decreased by 30%. If the original price was $200, what is the final price, in dollars?',
      responseFormat: 'numeric',
      expectedAnswer: '182',
      hints: [
        'Two chained changes multiply their multipliers: 1.30 × 0.70, not 30% − 30%.',
        '1.30 × 0.70 = 0.91. Final price = 0.91 × $200.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'misconception-cancel',
      kind: 'misconception_check',
      question:
        'A student says a price that goes up 50% and then down 50% returns to the original price, since "+50% and −50% cancel out." What went wrong?',
      commonErrors: [
        {
          answer: 'Same as the original price (0% net change)',
          misconception: 'Assumed opposite percent changes cancel by addition (+50% and −50% sum to 0%).',
          correctsTo:
            'Multiply the multipliers instead: 1.50 × 0.50 = 0.75. The final price is 75% of the original — a 25% DECREASE, not 0%. Opposite percents only cancel when you\'re comparing the SAME multiplier applied and undone (e.g., ×1.20 then ÷1.20), never when both steps use the raw percent.',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Percent change = (new − old) / old × 100 — always divide by the ORIGINAL value, never the new one.',
        'Increase by p%: multiply by (1 + p/100). Decrease by p%: multiply by (1 − p/100).',
        'Chained percent changes MULTIPLY their multipliers — they never add. +10% then +10% is ×1.21 (a 21% increase), not 20%.',
        'Reverse percentage: given the value AFTER a change, divide by the multiplier to recover the value BEFORE it — never just subtract the percent from the final value.',
      ],
      estimatedMinutes: 1,
    },
  ],
  source: TESTPREP_SOURCE,
  schemaVersion: 1,
  metadata: { cedUnit: '3', cedTopic: '3.2', cedTitle: 'Percentages' },
  pacingThresholds: TESTPREP_PACING_THRESHOLDS,
};
