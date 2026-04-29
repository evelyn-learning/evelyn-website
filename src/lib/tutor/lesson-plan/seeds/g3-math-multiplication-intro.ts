/**
 * G3 — Multiplication Intro (groups, arrays, equal repeated addition).
 *
 * The first time multiplication is named. Anchored on EQUAL GROUPS:
 * 4 plates × 3 cookies = 12 cookies. Connects to skip counting and
 * repeated addition the student already knows from G2. Builds the
 * "× means groups of" mental model BEFORE drilling facts.
 */

import type { LessonPlan } from '../types';

export const SEED_G3_MATH_MULTIPLICATION_INTRO: LessonPlan = {
  id: 'evelyn.g3.math.multiplication.intro.v1',
  title: 'Multiplication: Equal Groups',
  curriculum: 'CCSS',
  grade: '3',
  subject: 'math',
  topic: 'multiplication',
  locale: 'en',
  los: [
    {
      id: 'ccss.math.3.oa.a.1',
      description: 'Interpret products of whole numbers — e.g. 5×7 as 5 groups of 7 objects.',
      standard: 'CCSS.MATH.CONTENT.3.OA.A.1',
    },
    {
      id: 'ccss.math.3.oa.a.3',
      description: 'Use multiplication within 100 to solve word problems involving equal groups.',
      standard: 'CCSS.MATH.CONTENT.3.OA.A.3',
    },
  ],
  prerequisites: ['ccss.math.2.oa.c.4'],
  followUps: ['ccss.math.3.oa.b.5', 'ccss.math.3.oa.c.7'],
  estimatedMinutes: 16,
  segments: [
    {
      id: 'hook',
      kind: 'hook',
      goal: 'Show that adding the same number over and over is slow — there\'s a faster name for it.',
      script: 'You have 5 bags. Each bag has 4 marbles. How many marbles in total? You could add 4 + 4 + 4 + 4 + 4… or you could say "5 groups of 4" and just call it 5 times 4. Same answer, fewer words.',
      estimatedMinutes: 1,
    },
    {
      id: 'concept-equal-groups',
      kind: 'concept',
      goal: 'Multiplication = a count of equal groups. Two numbers, two roles.',
      keyIdeas: [
        'Multiplication is what you do when you have EQUAL groups and want the total.',
        'In 5 × 4, the first number (5) is HOW MANY groups. The second number (4) is HOW MANY in each group.',
        'You read it "five times four" or "five groups of four".',
        '× is the multiplication sign. The answer is called the PRODUCT.',
        'If groups aren\'t equal in size, multiplication doesn\'t apply — you\'d have to add them up the slow way.',
      ],
      vocabulary: [
        { term: 'multiplication', definition: 'a fast way to add equal groups.' },
        { term: 'product', definition: 'the answer to a multiplication problem.' },
        { term: 'factor', definition: 'each of the numbers being multiplied.' },
      ],
      suggestedTools: ['show_early_math', 'show_equation'],
      estimatedMinutes: 4,
    },
    {
      id: 'worked-3-groups-of-5',
      kind: 'worked_example',
      problem: 'There are 3 boxes. Each box has 5 crayons. How many crayons in all?',
      steps: [
        'Use show_early_math to draw 3 groups of 5 dots.',
        'Count the groups out loud: "Group 1 has 5… group 2 has 5… group 3 has 5."',
        'Write the repeated addition: 5 + 5 + 5 = 15.',
        'Now write the multiplication: 3 × 5 = 15. "Three groups of five equals fifteen."',
        'Point out: both ways give 15. Multiplication is just shorter.',
      ],
      answer: '15',
      estimatedMinutes: 3,
    },
    {
      id: 'try-1',
      kind: 'try_yourself',
      problem: 'Mira has 4 vases. Each vase has 6 flowers. How many flowers does Mira have in total?',
      expectedAnswer: '24',
      responseFormat: 'numeric',
      hints: [
        'How many groups? How many in each group?',
        'You can think 6 + 6 + 6 + 6, or jump to 4 × 6.',
      ],
      estimatedMinutes: 3,
    },
    {
      id: 'misconception-order',
      kind: 'misconception_check',
      question: 'Aiden writes 3 × 4 = 12 and Bea writes 4 × 3 = 12. Are both right?',
      commonErrors: [
        {
          answer: 'only one is right',
          misconception: 'Thinking the two numbers can\'t swap because the "story" is different.',
          correctsTo: 'They\'re both right — 3 groups of 4 and 4 groups of 3 both have 12 things. The PRODUCT is the same. (We\'ll come back to this — it\'s called the commutative property.)',
        },
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'recap',
      kind: 'recap',
      mustRemember: [
        'Multiplication = equal groups counted fast.',
        'In a × b, "a" is the number of groups, "b" is the size of each group.',
        'The answer is called the product.',
        'Repeated addition and multiplication give the same total.',
      ],
      estimatedMinutes: 2,
    },
    {
      id: 'extension',
      kind: 'extension',
      advancedQuestion: 'A spider has 8 legs. How many legs do 7 spiders have?',
      hint: '7 groups of 8. Try skip-counting by 8 seven times.',
      estimatedMinutes: 1,
    },
  ],
  source: { author: 'Evelyn Learning', org: 'Evelyn', license: 'proprietary' },
  schemaVersion: 1,
};
