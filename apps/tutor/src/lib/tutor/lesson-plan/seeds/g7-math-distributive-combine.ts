/**
 * G7 — Distributive property and combining like terms.
 *
 * Two algebra-essential moves for simplifying expressions and
 * setting up equations. Distributive: a(b + c) = ab + ac.
 * Combining like terms: only terms with the same variable (and same
 * power) can be combined. Together they reduce ugly expressions to
 * one term per kind.
 */

import type { LessonPlan } from '../types';

export const SEED_G7_MATH_DISTRIBUTIVE_COMBINE: LessonPlan = {
  id: 'evelyn.g7.math.distributive-combine.v1',
  title: 'Distributive Property and Combining Like Terms',
  curriculum: 'CCSS',
  grade: '7',
  subject: 'math',
  topic: 'expressions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.7.ee.a.1',
      description: 'Apply properties of operations to add, subtract, factor, and expand linear expressions.',
      standard: 'CCSS.MATH.CONTENT.7.EE.A.1',
    },
  ],
  prerequisites: ['ccss.math.6.ee.a.2'],
  followUps: ['ccss.math.8.ee.c.7'],
  estimatedMinutes: 17,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Use the distributive idea on a real shopping context — bundle pricing.',
      script: 'You\'re buying 3 lunch combos. Each combo has a $4 sandwich and a $2 drink. Total cost? You could think 3 × ($4 + $2) = 3 × $6 = $18. Or you could think 3 × $4 + 3 × $2 = $12 + $6 = $18. Same answer, two paths. That equality is the distributive property.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-distribute-combine',
      kind: 'concept',
      goal: 'a(b + c) = ab + ac. And: only LIKE terms can be combined.',
      keyIdeas: [
        'DISTRIBUTIVE PROPERTY: a(b + c) = a × b + a × c. Multiply the outside term by EACH inside term.',
        'Works with subtraction too: a(b - c) = ab - ac.',
        'Watch the sign: -3(x - 2) = -3x + 6. The minus sign distributes too.',
        'COMBINING LIKE TERMS: terms with the SAME variable (and same exponent) can be added/subtracted.',
        'LIKE: 3x and 5x (both have x). UNLIKE: 3x and 5y (different variables). UNLIKE: 3x and 3x² (different powers).',
        'To combine: add/subtract the COEFFICIENTS, keep the variable. 3x + 5x = 8x. 7y - 2y = 5y.',
        'Constants combine with constants: 3 + 7 = 10.',
        'Strategy for ugly expressions: distribute first, THEN combine like terms.',
      ],
      vocabulary: [
        { term: 'distributive property', definition: 'a(b + c) = ab + ac. Multiply outside by each inside.' },
        { term: 'like terms', definition: 'terms with the same variable raised to the same power.' },
      ],
      suggestedTools: ['show_equation'],
      estimatedMinutes: 5,
    },
    {
      id: 'worked-distribute',
      kind: 'worked_example',
      problem: 'Expand 4(x + 3).',
      steps: [
        'Distribute the 4 to each term inside: 4 × x + 4 × 3.',
        '4x + 12.',
        'Done. (Cannot combine — 4x and 12 are unlike terms.)',
      ],
      answer: '4x + 12',
      estimatedMinutes: 3,
    },
    {
      id: 'worked-combine',
      kind: 'worked_example',
      problem: 'Simplify 2(3x + 5) - 4x.',
      steps: [
        'Distribute first: 2(3x + 5) = 2 × 3x + 2 × 5 = 6x + 10.',
        'Now: 6x + 10 - 4x.',
        'Combine like terms: 6x and -4x are like (both have x). 6x - 4x = 2x.',
        '10 has no x term to combine with — stays.',
        'Final: 2x + 10.',
      ],
      answer: '2x + 10',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Simplify 3(x + 4) + 2x.',
      expectedAnswer: '5x + 12',
      responseFormat: 'free',
      hints: [
        'First distribute the 3: 3x + 12.',
        'Then combine 3x and 2x.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-only-first',
      kind: 'misconception_check',
      question: 'Sami expands 5(x + 2) and writes 5x + 2. What\'s the problem?',
      commonErrors: [
        {
          answer: 'nothing',
          misconception: 'Distributing only to the FIRST term inside the parentheses.',
          correctsTo: 'The 5 must hit BOTH terms inside the parentheses. 5(x + 2) = 5x + 10, not 5x + 2. (Sense check: 5(x + 2) when x = 1 should be 5(3) = 15. Sami\'s answer gives 5(1) + 2 = 7. Different — so it\'s wrong.)',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Distribute: multiply the outside by EVERY term inside.',
        'Watch signs: -a(b - c) = -ab + ac.',
        'Like terms: same variable AND same power. Coefficients add/subtract.',
        'Strategy: distribute FIRST, then combine like terms.',
        'Constants are like terms with each other (no variable).',
      ],
      estimatedMinutes: 1,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Simplify -2(3x - 4) + 5x.',
      hint: 'Distribute -2: -6x + 8 (the minus distributes through both terms). Now: -6x + 8 + 5x. Combine: -x + 8.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
