/**
 * JEE Math — Probability and Permutations/Combinations.
 */

import type { LessonPlan } from '../types';

export const SEED_JEE_MATH_PROBABILITY_PERMUTATIONS: LessonPlan = {
  id: 'evelyn.jee.math.probability-permutations.v1',
  title: 'JEE Math — Probability and P&C',
  curriculum: 'JEE-MAIN',
  grade: 'iitjee',
  subject: 'test-prep',
  topic: 'jee-math',
  locale: 'en',
  los: [{ id: 'jee.math.probability-permutations', description: 'Drill JEE permutations, combinations, conditional probability, Bayes theorem, binomial distribution.', standard: 'JEE-MATH-PROB' }],
  prerequisites: [],
  followUps: [],
  estimatedMinutes: 16,
  segments: [
    { id: 'hook', kind: 'hook', goal: 'Probability + P&C is high-yield on JEE — and reliably solvable with the right framework.', script: 'JEE Probability and P&C questions look intimidating but reduce to a few canonical patterns: arrangements, selections, conditional probability, Bayes\' theorem. Today: the toolbox + the patterns to recognise instantly.', estimatedMinutes: 1 },
    { id: 'concept', kind: 'concept', goal: 'P&C formulas, probability rules, conditional + Bayes, distributions.', keyIdeas: [
      'PERMUTATIONS — order matters. P(n,r) = n!/(n−r)!.',
      'COMBINATIONS — order doesn\'t matter. C(n,r) = n!/(r!(n−r)!).',
      'KEY PROBLEM types:',
      '  ARRANGE n distinct objects: n! ways.',
      '  ARRANGE n with k identical: n!/(k!).',
      '  SELECT r from n: C(n,r).',
      '  AT LEAST/AT MOST: use complement when easier.',
      '  CIRCULAR arrangements: (n−1)! (one position is "free").',
      'PROBABILITY basics:',
      '  P(A) = (favorable outcomes)/(total outcomes), 0 ≤ P ≤ 1.',
      '  P(A or B) = P(A) + P(B) − P(A ∩ B).',
      '  P(A and B) (independent) = P(A) · P(B).',
      'CONDITIONAL: P(A|B) = P(A ∩ B)/P(B).',
      'BAYES\' THEOREM: P(A|B) = P(B|A) · P(A) / P(B).',
      '  Used for "given the test was positive, what\'s the probability of disease?" type problems.',
      'BINOMIAL DISTRIBUTION: n independent trials, each with success probability p.',
      '  P(exactly k successes) = C(n,k) · pᵏ · (1−p)^(n−k).',
      '  Mean: np. Variance: np(1−p).',
      'COMMON JEE TRAPS:',
      '  Confusing "at least" with "exactly."',
      '  Missing complementary events.',
      '  Treating dependent events as independent.',
    ], vocabulary: [{ term: 'Bayes theorem', definition: 'P(A|B) = P(B|A)·P(A)/P(B); inverts conditional probability.' }, { term: 'binomial distribution', definition: 'n independent yes/no trials; counts successes. P(k) = C(n,k)pᵏ(1-p)^(n-k).' }], estimatedMinutes: 6 },
    { id: 'worked', kind: 'worked_example', problem: 'A bag has 5 red and 3 blue marbles. Three are drawn without replacement. What is P(all 3 red)?', steps: [
      'Method 1 (combinations): favorable = C(5,3) = 10. Total = C(8,3) = 56. P = 10/56 = 5/28.',
      'Method 2 (sequential): P(1st red) = 5/8. P(2nd red | 1st red) = 4/7. P(3rd red | first two red) = 3/6 = 1/2.',
      'P(all 3 red) = (5/8)(4/7)(1/2) = 20/112 = 5/28. Same answer. ✓',
    ], answer: '5/28', estimatedMinutes: 4 },
    { id: 'try-1', kind: 'try_yourself', problem: 'A coin is tossed 5 times. What is P(exactly 3 heads)?', expectedAnswer: 'Binomial: n = 5, k = 3, p = 1/2. P = C(5,3)(1/2)³(1/2)² = 10 · (1/32) = 10/32 = 5/16.', responseFormat: 'free', hints: ['Each toss is independent. Use binomial.', 'C(n,k)pᵏ(1-p)^(n-k).'], estimatedMinutes: 3 },
    { id: 'misconception-replacement', kind: 'misconception_check', question: 'A student computes P(2 reds drawn from a bag of 5R, 3B) WITHOUT REPLACEMENT as (5/8)² = 25/64. What\'s wrong?', commonErrors: [{ answer: 'Treats sequential draws as independent', misconception: 'Forgetting that without replacement, probabilities change.', correctsTo: 'Without replacement, the second draw\'s probability depends on the first. P(2nd red | 1st red) = 4/7 (one red and one ball already gone), not 5/8. Correct: P(2 reds) = (5/8)(4/7) = 20/56 = 5/14. WITH replacement, the calculation (5/8)² = 25/64 would be correct. Always check: with or without replacement?' }], estimatedMinutes: 3 },
    { id: 'recap', kind: 'recap', mustRemember: ['P(n,r) order matters; C(n,r) order doesn\'t.', 'Conditional: P(A|B) = P(A∩B)/P(B).', 'Bayes inverts: P(A|B) = P(B|A)P(A)/P(B).', 'Binomial: P(k successes) = C(n,k)pᵏ(1−p)^(n−k).', 'With/without replacement matters — sequential probabilities change.'], estimatedMinutes: 1 },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
