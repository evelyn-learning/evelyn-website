/**
 * Seed lesson plan: Grade 6 — adding fractions with unlike denominators.
 *
 * Reference plan used to validate the schema end-to-end and to demo
 * lesson-plan-driven tutoring on the public demo site. Hand-authored;
 * future plans may be ingested from partner formats and parsed via
 * `parseLessonPlan`.
 */

import type { LessonPlan } from '../types';

export const SEED_G6_FRACTIONS_ADD_UNLIKE: LessonPlan = {
  id: 'evelyn.g6.math.fractions.add-unlike-denoms.v1',
  title: 'Adding Fractions with Unlike Denominators',
  curriculum: 'CCSS',
  grade: '6',
  subject: 'math',
  topic: 'fractions',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.5.nf.a.1',
      description: 'Add and subtract fractions with unlike denominators by replacing them with equivalent fractions with a common denominator.',
      standard: 'CCSS.MATH.CONTENT.5.NF.A.1',
    },
  ],
  prerequisites: [
    'ccss.math.4.nf.a.1',
    'ccss.math.4.nf.b.3',
  ],
  followUps: [
    'ccss.math.5.nf.a.2',
    'ccss.math.6.ns.a.1',
  ],
  estimatedMinutes: 18,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Make the student curious about why we cannot just add the tops and bottoms when denominators differ.',
      script: 'Quick puzzle: if you eat 1/2 of a small pizza and your friend eats 1/3 of a different small pizza, did you two together eat 2/5 of the food?',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-1',
      kind: 'concept',
      goal: 'Establish that fractions can only be added when they refer to pieces of the same size — i.e., a common denominator.',
      keyIdeas: [
        'A fraction names how many equal pieces of a whole you have.',
        'Adding fractions means combining counts of pieces.',
        'You can only combine counts when the pieces are the same size.',
        'Different denominators = different piece sizes — so we rewrite the fractions to share a piece size first.',
      ],
      vocabulary: [
        { term: 'denominator', definition: 'the bottom number — how many equal pieces the whole is split into.' },
        { term: 'common denominator', definition: 'a single denominator that both fractions can be rewritten with.' },
      ],
      suggestedTools: ['show_fraction_bar', 'show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-1',
      kind: 'worked_example',
      problem: 'Compute 1/2 + 1/3.',
      steps: [
        'The denominators are 2 and 3 — different piece sizes.',
        'Find a common denominator: the smallest number both 2 and 3 divide into is 6.',
        'Rewrite 1/2 with denominator 6: multiply top and bottom by 3 → 3/6.',
        'Rewrite 1/3 with denominator 6: multiply top and bottom by 2 → 2/6.',
        'Now both pieces are sixths — add the numerators: 3 + 2 = 5.',
        'Answer: 5/6.',
      ],
      answer: '5/6',
      estimatedMinutes: 4,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Try this one: 1/4 + 2/3. Walk me through it.',
      expectedAnswer: '11/12',
      responseFormat: 'frq',
      hints: [
        'What is the smallest number both 4 and 3 divide into?',
        'Rewrite each fraction with denominator 12 first, then add the numerators.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-1',
      kind: 'misconception_check',
      question: 'A friend says "1/2 + 1/3 = 2/5 because we just add tops and bottoms." Where did they go wrong?',
      commonErrors: [
        {
          answer: '2/5',
          misconception: 'Adding numerators and denominators directly, ignoring that the pieces are different sizes.',
          correctsTo: 'Rewrite to a common denominator first; only then add numerators (denominator stays).',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Different denominators = different piece sizes — you must rewrite first.',
        'Common denominator = a number both denominators divide into evenly.',
        'When you rewrite a fraction, multiply BOTH top and bottom by the same number.',
        'After rewriting, add the numerators only — the denominator stays.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'Compute 5/6 + 7/8 + 1/4. (Hint: find a common denominator for ALL three.)',
      hint: 'The smallest number 6, 8, and 4 all divide into is 24.',
      estimatedMinutes: 2,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
