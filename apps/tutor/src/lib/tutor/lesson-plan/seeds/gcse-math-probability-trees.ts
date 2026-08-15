/**
 * GCSE Math Higher — Probability Tree Diagrams.
 * Independent and dependent events, replacement vs without-replacement,
 * combining branch probabilities by multiplication and addition.
 */

import type { LessonPlan } from '../types';

export const SEED_GCSE_MATH_PROBABILITY_TREES: LessonPlan = {
  id: 'evelyn.gcse.math.probability-trees.v1',
  title: 'GCSE Higher — Probability Tree Diagrams',
  curriculum: 'GCSE',
  grade: '10-11',
  subject: 'math',
  topic: 'gcse-math',
  locale: 'en-GB',
  los: [
    {
      id: 'gcse.math.probability-trees',
      description: 'Construct probability trees for two-stage events, distinguish independent vs dependent events, and combine probabilities using AND/OR rules.',
      standard: 'GCSE-MATH-P8/P9',
    },
  ],
  prerequisites: [],
  followUps: ['gcse.math.conditional-prob'],
  estimatedMinutes: 22,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Tree diagrams turn confusing "draw two balls without replacement" problems into a flowchart you can read with arithmetic.',
      script: 'A jar of red and blue balls. Draw one, don\'t replace, draw another. What\'s the probability of one of each? Without a tree, students panic. With a tree, you trace branches: P(red then blue) plus P(blue then red), each computed by multiplying along the branch. The diagram does the bookkeeping.',
      estimatedMinutes: 2,
    },
    {
      id: 'concept-trees',
      kind: 'concept',
      goal: 'Building trees, branch multiplication, the AND/OR rules, independence vs dependence.',
      keyIdeas: [
        'BRANCH PROBABILITIES at each node SUM to 1. (Every possible outcome at that stage is enumerated.)',
        'AND rule (along a single path): multiply branch probabilities. P(A then B) = P(A) × P(B given A).',
        'OR rule (across paths): add the path probabilities for outcomes that satisfy the question.',
        'INDEPENDENT EVENTS: P(B given A) = P(B). Probabilities at the second stage are unchanged. Example: rolling a die twice.',
        'DEPENDENT EVENTS: probabilities CHANGE based on the first outcome. Drawing without replacement is the classic case.',
        'WITHOUT REPLACEMENT: after a successful first draw, the denominator drops by 1. Numerator drops by 1 IF the first draw was that colour.',
        'TREE TIP: label every branch with its probability AND the outcome name. End-of-path = combined probability. Sum of all path probabilities should equal 1.',
        'EXACTLY-ONE counting: for "exactly one red in two draws" enumerate paths: RB and BR. Sum their probabilities.',
      ],
      vocabulary: [
        { term: 'independent', definition: 'two events where the outcome of one doesn\'t affect the probability of the other.' },
        { term: 'without replacement', definition: 'a sampling method where the first item is not returned before the second is drawn — making the events dependent.' },
      ],
      estimatedMinutes: 6,
    },
    {
      id: 'worked-without-replacement',
      kind: 'worked_example',
      problem: 'A bag contains 4 red and 6 blue balls. Two are drawn without replacement. Find the probability that one is red and one is blue.',
      steps: [
        'Total balls = 10 initially.',
        'PATH RB (red first, blue second): P(R) = 4/10. After removing one red, 3 red and 6 blue remain (9 total). P(B given R) = 6/9.',
        'P(RB) = (4/10)·(6/9) = 24/90.',
        'PATH BR (blue first, red second): P(B) = 6/10. After removing one blue, 4 red and 5 blue remain (9 total). P(R given B) = 4/9.',
        'P(BR) = (6/10)·(4/9) = 24/90.',
        'Either order satisfies "one of each", so add: P(one red and one blue) = 24/90 + 24/90 = 48/90 = 8/15.',
        'SANITY CHECK: alternative — P(both same colour) = P(RR) + P(BB) = (4/10·3/9) + (6/10·5/9) = 12/90 + 30/90 = 42/90 = 7/15. And 8/15 + 7/15 = 15/15. ✓',
      ],
      answer: '8/15',
      estimatedMinutes: 6,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'A coin is flipped twice. Find the probability of getting at least one head.',
      expectedAnswer: '3/4',
      responseFormat: 'free',
      hints: [
        '"At least one head" = NOT "no heads".',
        'P(no heads) = P(TT) = (1/2)·(1/2) = 1/4.',
        'P(at least one head) = 1 − 1/4.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-replacement',
      kind: 'misconception_check',
      question: 'A bag has 3 red and 5 blue balls. Two drawn WITH replacement. P(both red) = ?',
      commonErrors: [
        {
          answer: '(3/8)·(2/7) = 6/56',
          misconception: 'Reducing the denominator (and red count) on the second draw, even when the ball was replaced.',
          correctsTo: 'WITH REPLACEMENT means the ball goes back. The bag has 3 red and 5 blue BOTH times. P(red, red) = (3/8)·(3/8) = 9/64. Always read carefully whether it\'s with or without replacement — the probabilities differ noticeably for small bags. The (3/8)·(2/7) form is correct only for WITHOUT replacement.',
        },
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'AND along a path: multiply branch probabilities.',
        'OR across paths: add path probabilities.',
        'Independent events: P(B given A) = P(B). Without replacement: dependent — denominator drops.',
        'Use the complement ("at least one" = 1 − "none") to avoid enumerating many paths.',
        'Verify: sum of all final-path probabilities should equal 1.',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A bag has 4 red and 6 blue balls. Three are drawn without replacement. Find P(at least two reds).',
      hint: 'Outcomes that satisfy: RRR, RRB, RBR, BRR. Compute each: RRR = (4/10)(3/9)(2/8) = 24/720. RRB = (4/10)(3/9)(6/8) = 72/720. RBR = (4/10)(6/9)(3/8) = 72/720. BRR = (6/10)(4/9)(3/8) = 72/720. Sum = 240/720 = 1/3.',
      estimatedMinutes: 3,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
