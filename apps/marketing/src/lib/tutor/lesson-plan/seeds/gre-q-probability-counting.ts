/**
 * GRE Quant — Probability & Counting.
 */

import type { LessonPlan } from '../types';

export const SEED_GRE_Q_PROBABILITY_COUNTING: LessonPlan = {
  id: 'evelyn.gre.q.probability-counting.v1',
  title: 'GRE Quant — Probability & Counting',
  curriculum: 'GRE',
  grade: 'graduate',
  subject: 'math',
  topic: 'gre-quant',
  locale: 'en',
  los: [
    {
      id: 'gre.q.probability-counting',
      description: 'Use permutations, combinations, basic probability rules, and the multiplication principle to solve GRE counting and probability problems.',
      standard: 'GRE-Q-PROB',
    },
  ],
  prerequisites: ['gre.q.statistics'],
  followUps: ['gre.q.quant-comparison'],
  estimatedMinutes: 23,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'GRE probability questions usually reduce to counting — count favourable, count total, divide.',
      script: 'When all outcomes are equally likely, P(event) = (favourable count)/(total count). The skill is COUNTING accurately. Permutations care about order; combinations don\'t. Pick the right formula and the answer drops out.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-counting-prob',
      kind: 'concept',
      goal: 'Multiplication principle + permutations + combinations + probability rules.',
      keyIdeas: [
        'MULTIPLICATION PRINCIPLE: independent stages multiply. n_1 · n_2 · … · n_k.',
        'PERMUTATIONS (order MATTERS): nPr = n!/(n−r)! ways to arrange r items chosen from n.',
        'COMBINATIONS (order DOESN\'T matter): nCr = n!/[r!(n−r)!] ways to choose r from n.',
        'KEY DECISION: "select" or "choose" → combinations. "Arrange" or "order" → permutations.',
        'BASIC PROBABILITY: P(A) = (favourable)/(total). 0 ≤ P ≤ 1.',
        'COMPLEMENT: P(A\') = 1 − P(A). Often easier to count "not A" than A directly.',
        'INDEPENDENCE: P(A ∩ B) = P(A)·P(B). Examples: separate dice rolls.',
        'WITHOUT REPLACEMENT (drawing balls from bag): P updates after each draw — denominator drops, numerator may drop.',
        'AT LEAST ONE: complement trick. P(at least one) = 1 − P(none).',
      ],
      vocabulary: [
        { term: 'permutation', definition: 'an ordered arrangement; nPr = n!/(n − r)!.' },
        { term: 'combination', definition: 'an unordered selection; nCr = n!/[r!(n−r)!].' },
      ],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-combinations',
      kind: 'worked_example',
      problem: 'A committee of 3 is chosen from 7 people. How many committees are possible?',
      steps: [
        'Order doesn\'t matter (committee = same people). Use combinations.',
        '7C3 = 7!/(3!·4!) = (7·6·5)/(3·2·1) = 210/6 = 35.',
      ],
      answer: '35',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A bag has 4 red and 3 blue balls. Two are drawn without replacement. Probability both are red?',
      expectedAnswer: '2/7',
      responseFormat: 'free',
      hints: [
        'P(first red) = 4/7.',
        'P(second red | first red) = 3/6 = 1/2.',
        'P(both red) = 4/7 · 1/2 = 4/14 = 2/7.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-perm-comb',
      kind: 'misconception_check',
      question: 'A student computes "ways to arrange 3 books on a shelf from a set of 5" using nC3 = 10. What\'s wrong?',
      commonErrors: [
        {
          answer: 'nC3 = 10',
          misconception: 'Treating "arrange" as a combinations problem when it\'s actually permutations (order matters).',
          correctsTo: '"Arrange on a shelf" cares about order — book A then B then C is different from C then B then A. Use permutations: 5P3 = 5!/2! = 60. Combinations only count which 3 books are chosen, ignoring arrangement; permutations include the orderings, so 5P3 = 5C3 × 3! = 10 × 6 = 60.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Multiplication principle: independent stages multiply.',
        'Permutations (ORDER): nPr = n!/(n − r)!.',
        'Combinations (NO ORDER): nCr = n!/[r!(n − r)!].',
        'P(at least one) = 1 − P(none).',
        'Without replacement: probabilities update after each draw.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Three fair coins are flipped. What is the probability that at least one is tails?',
      hint: 'P(at least one tails) = 1 − P(no tails) = 1 − P(all heads) = 1 − (1/2)³ = 1 − 1/8 = 7/8.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
